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
import createTable from './createTable'
import './index.css'

const ipcRenderer = window.require && window.require('electron')?.ipcRenderer

export type TestCaseT = {
  key: number,
  input: string,
  expectOutput: string,
  actualOutput: string,
  methodType: string,
  notes: string,
  passed: boolean,
  tested: boolean
}

interface testCaseFileItem {
  input: string,
  expectOutput: string,
  methodType: string,
  notes: string
}

export default function ExeTestPage() {
  const [testCases, setTestCases] = useState([] as TestCaseT[])

  listenMain(testCases, setTestCases)

  const {
    testIt,
    testCasesFileOnChange,
    exeFileOnChange,
    testAllCases
  } = getMethods(testCases, setTestCases)

  return (
    <div className="exe-test-page">
      <div className="exe-test-page-control-bar">
        <div>exe 程序:</div>
        <input type="file" onChange={exeFileOnChange}></input>
        <div>测试用例:</div>
        <input type="file" onChange={testCasesFileOnChange}></input>
        <button className="ms-button primary" onClick={testAllCases}>测试全部</button>
      </div>
      {createTable(testCases, testIt)}
    </div>
  )
}

/**
 * 获取组件用到的函数
 * @param testCases 
 * @param setTestCases 
 * @returns 
 */
function getMethods(testCases: TestCaseT[], setTestCases: React.Dispatch<React.SetStateAction<TestCaseT[]>>) {
  /**
   * 执行测试，测试用例从参数传入
   * @param cases 
   */
  function runTest(cases: TestCaseT[]) {
    ipcRenderer.send('runTest', cases)
  }
  /**
   * 测试一条测试用例，用例 key 由参数指定
   * @param key 
   */
  function testIt(key: number) {
    runTest(testCases.filter(theCase => theCase.key === key))
  }
  /**
   * 测试用例文件更改时触发，读取测试用例文件
   * @param e 
   */
  function testCasesFileOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log('testCasesFileOnChange')
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      if (e.target?.result) {
        const dataString = e.target?.result.toString()
        const data = JSON.parse(dataString).data as testCaseFileItem[]
        setTestCases(data.map((item, index) => ({
          key: index,
          input: item.input,
          expectOutput: item.expectOutput,
          actualOutput: '',
          methodType: item.methodType,
          notes: item.notes,
          passed: false,
          tested: false
        })))
      }
    }
    e.target.files
      && e.target.files.length > 0
      && fileReader.readAsText(e.target.files[0])
  }
  /**
   * exe 更改时触发，读取并转存 exe，测试状态重置
   * @param e_inputEle 
   */
  function exeFileOnChange(e_inputEle: React.ChangeEvent<HTMLInputElement>) {
    // 读取并转存 exe
    const fileReader = new FileReader()
    fileReader.onload = (e_fileReader) => {
      if (e_fileReader.target?.result) {
        ipcRenderer?.send('importExeFile', e_fileReader.target.result)
      }
    }
    e_inputEle.target.files
      && e_inputEle.target.files.length > 0
      && fileReader.readAsArrayBuffer(e_inputEle.target.files[0])
    // 测试状态重置
    const newTestCases = Array.from(testCases)
    newTestCases.forEach(thisCase => {
      thisCase.tested = false
    })
    setTestCases(newTestCases)
  }
  /**
   * 测试全部用例
   */
  function testAllCases() {
    // 测试状态重置
    const newTestCases = Array.from(testCases)
    newTestCases.forEach(thisCase => {
      thisCase.tested = false
    })
    setTestCases(newTestCases)
    // 测试
    ipcRenderer.send('runTest', testCases)
  }

  return {
    runTest,
    testIt,
    exeFileOnChange,
    testCasesFileOnChange,
    testAllCases
  }
}

/**
 * 监听主线程消息
 * @param testCases 
 * @param setTestCases 
 */
function listenMain(testCases: TestCaseT[], setTestCases: React.Dispatch<React.SetStateAction<TestCaseT[]>>) {
  ipcRenderer?.removeAllListeners('testFinished')
  ipcRenderer?.on('testFinished', async (event: Event, actualOutputs: { key: number, value: string }) => {
    let newTestCases = JSON.parse(JSON.stringify(testCases)) as TestCaseT[]
    for (let j in newTestCases) {
      if (newTestCases[j].key === actualOutputs.key) {
        const actualOutput = await gbk2utf8(actualOutputs.value) // 对中文仍然无效
        newTestCases[j].actualOutput = actualOutput
        newTestCases[j].passed = newTestCases[j].expectOutput === actualOutput
        newTestCases[j].tested = true
        break
      }
    }
    setTestCases(newTestCases)
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