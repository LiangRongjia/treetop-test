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
  checked: boolean,
  passed: boolean,
  tested: boolean
}

interface testCaseFileItem {
  input: string,
  expectOutput: string,
  actualOutput: string,
  methodType: string,
  notes: string
}

export default function ExeTestPage() {
  const [testCases, setTestCases] = useState([{
    key: 0,
    input: 'input',
    expectOutput: 'expectOutput',
    actualOutput: 'actualOutput',
    methodType: 'methodType',
    notes: 'notes',
    checked: true,
    passed: false,
    tested: false
  }])

  listenMain(testCases, setTestCases)

  const {
    testIt,
    checkIt,
    testCasesFileOnChange,
    exeFileOnChange
  } = getMethods(testCases, setTestCases)

  return (
    <div className="exe-test-page">
      <div className="exe-test-page-control-bar">
        <div>exe 程序:</div>
        <input type="file" onChange={exeFileOnChange}></input>
        <div>测试用例:</div>
        <input type="file" onChange={testCasesFileOnChange}></input>
        <button className="ms-button primary">测试勾选项</button>
      </div>
      {createTable(testCases, testIt, checkIt)}
    </div>
  )
}

function getMethods(testCases: TestCaseT[], setTestCases: React.Dispatch<React.SetStateAction<TestCaseT[]>>) {
  function checkIt(key: number) {
    for (let i in testCases) {
      if (testCases[i].key === key) {
        testCases[i].checked = !testCases[i].checked
      }
    }
    setTestCases([...testCases])
  }
  function runTest(cases: TestCaseT[]) {
    ipcRenderer.send('runTest', cases)
  }
  function testIt(key: number) {
    runTest(testCases.filter(theCase => theCase.key === key))
  }
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
          checked: true,
          passed: false,
          tested: false
        })))
      }
    }
    e.target.files
      && e.target.files.length > 0
      && fileReader.readAsText(e.target.files[0])
  }
  function exeFileOnChange(e_inputEle: React.ChangeEvent<HTMLInputElement>) {
    console.log('exeFileOnChange')
    const fileReader = new FileReader()
    fileReader.onload = (e_fileReader) => {
      if (e_fileReader.target?.result) {
        ipcRenderer?.send('importExeFile', e_fileReader.target.result)
      }
    }
    e_inputEle.target.files
      && e_inputEle.target.files.length > 0
      && fileReader.readAsArrayBuffer(e_inputEle.target.files[0])
  }
  return {
    checkIt,
    runTest,
    testIt,
    exeFileOnChange,
    testCasesFileOnChange
  }
}

function listenMain(testCases: TestCaseT[], setTestCases: React.Dispatch<React.SetStateAction<TestCaseT[]>>) {
  ipcRenderer?.removeAllListeners('testFinished')
  ipcRenderer?.on('testFinished', (event: Event, actualOutputs: { key: number, value: string }) => {
    let newTestCases = JSON.parse(JSON.stringify(testCases)) as TestCaseT[]
    for (let j in newTestCases) {
      if (newTestCases[j].key === actualOutputs.key) {
        newTestCases[j].actualOutput = actualOutputs.value
        newTestCases[j].passed = newTestCases[j].expectOutput === actualOutputs.value
        newTestCases[j].tested = true
        break
      }
    }
    setTestCases(newTestCases)
  })
}