// 本页面是 exe 测试页面
// - 功能
//   - 解析配置文件
//   - 上传 exe 文件，存到自己的空间中
//   - 上传测试配置文件
//   - 解析配置文件，生成列表
//   - 可选某项测试用例进行测试
//   - 可勾选多项测试用例进行测试，提供全选、全不选按钮
//   - 勾选预设测试组
//   - // 编辑测试配置
//   - 保存测试配置

import React, { useState } from 'react'
import { TestCaseT } from '../interfacesAndTypes'
import TestCasesTable from '../components/TestCasesTable/index'
import getMethods from './getMethods'
import './index.css'

const ipcRenderer = window.require && window.require('electron')?.ipcRenderer

export default function JavaTestPage() {
  const [testCases, setTestCases] = useState([] as TestCaseT[])

  listenMain(testCases, setTestCases)

  const {
    testIt,
    testCasesFileOnChange,
    javaFileOnChange,
    javaTestAllCases
  } = getMethods(testCases, setTestCases)

  return (
    <div className="java-test-page">
      <div className="java-test-page-control-bar">
        <div>java 源代码:</div>
        <input type="file" onChange={javaFileOnChange}></input>
        <div>测试用例:</div>
        <input type="file" onChange={testCasesFileOnChange}></input>
        <button className="ms-button primary" onClick={javaTestAllCases}>测试全部</button>
      </div>
      <TestCasesTable data={testCases} testIt={testIt} />
    </div>
  )
}

/**
 * 监听主线程消息
 * @param testCases 
 * @param setTestCases 
 */
function listenMain(testCases: TestCaseT[], setTestCases: React.Dispatch<React.SetStateAction<TestCaseT[]>>) {
  ipcRenderer?.removeAllListeners('javaTestFinished')
  ipcRenderer?.on('javaTestFinished', async (event: Event, actualOutputs: { key: number, value: string }) => {
    for (let j in testCases) {
      if (testCases[j].key === actualOutputs.key) {
        const actualOutput = await gbk2utf8(actualOutputs.value) // 对中文仍然无效
        testCases[j].actualOutput = actualOutput
        testCases[j].passed = testCases[j].expectOutput === actualOutput
        testCases[j].tested = true
        break
      }
    }
    setTestCases([...testCases])
  })
}
/**
 * string 转 ArrayBuffer
 * @param str 
 * @returns 
 */
async function gbk2utf8(str: string): Promise<string> {
  const decoder = new TextDecoder('gbk')
  const b = new Blob([str])
  const f = new FileReader()
  let ab
  return new Promise((res, rej) => {
    f.onload = (e) => {
      ab = e.target?.result
      res(decoder.decode(ab as ArrayBuffer) as string)
    }
    f.readAsArrayBuffer(b)
  })
}