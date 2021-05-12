import { TestCaseT, testCaseFileItem } from '../interfacesAndTypes'

const ipcRenderer = window.require && window.require('electron')?.ipcRenderer

// 向主进程发送两个事件 [ 'exeRunTest', 'importExeFile' ]

/**
 * 获取组件用到的函数
 * @param testCases 
 * @param setTestCases 
 * @returns 
 */
export default function getMethods(testCases: TestCaseT[], setTestCases: React.Dispatch<React.SetStateAction<TestCaseT[]>>) {
    /**
     * 执行测试，测试用例从参数传入
     * @param cases 
     */
    function runTest(cases: TestCaseT[]) {
        ipcRenderer?.send('exeRunTest', cases)
    }
    /**
     * 测试一条测试用例，用例 key 由参数指定
     * @param key 
     */
    function testIt(key: number) {
        // 清除测试状态
        const newTestCases = JSON.parse(JSON.stringify(testCases)) as TestCaseT[]
        newTestCases.forEach(thisCase => {
            thisCase.key === key && (thisCase.tested = false)
        })
        setTestCases(newTestCases)
        // 运行测试
        runTest(testCases.filter(theCase => theCase.key === key))
    }
    /**
     * 测试用例文件更改时触发，读取测试用例文件
     * @param e 
     */
    function testCasesFileOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTestCases([])
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

        resetTestCases()
    }
    /**
     * exe 测试全部用例
     */
    function exeTestAllCases() {
        // 测试状态重置
        resetTestCases()
        // 测试
        runTest(testCases)
    }
    /**
     * 重置测试状态
     */
    function resetTestCases() {
        const newTestCases = Array.from(testCases)
        newTestCases.forEach(thisCase => {
            thisCase.tested = false
            thisCase.actualOutput = ''
        })
        setTestCases(newTestCases)
        return newTestCases
    }

    return {
        runTest,
        testIt,
        exeFileOnChange,
        testCasesFileOnChange,
        exeTestAllCases,
    }
}
