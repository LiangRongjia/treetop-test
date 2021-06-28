// 本页面是集成测试页面

import { useState } from 'react'
import { IntegrationTestCaseT } from '../interfacesAndTypes'
import TestCasesTable from './TestCasesTable/index'
import getMethods from './getMethods'
import './index.css'


export default function IntegrationTestPage() {
  const [testCases, setTestCases] = useState([] as IntegrationTestCaseT[])

  const {
    testOne,
    testCasesFileOnChange,
    testAllCases
  } = getMethods(testCases, setTestCases)

  const count = countResult(testCases)

  return (
    <div className="exe-test-page">
      <div className="exe-test-page-control-bar">
        <div>测试用例:</div>
        <input type="file" onChange={testCasesFileOnChange}></input>
        <div>通过: {count.passed} / 未通过: {count.notPassed}</div>
        <button className="ms-button primary" onClick={testAllCases}>全部测试</button>
      </div>
      <TestCasesTable data={testCases} testIt={testOne} />
    </div>
  )
}

function countResult(cases: IntegrationTestCaseT[]) {
  const passed = cases.filter(c => c.tested && c.passed).length
  const notPassed = cases.length - passed
  return { passed, notPassed }
}