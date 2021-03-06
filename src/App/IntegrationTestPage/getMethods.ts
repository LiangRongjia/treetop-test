import { IntegrationTestCaseFileItem, IntegrationTestCaseT } from '../interfacesAndTypes'

/**
 * 获取组件用到的函数
 * @param testCases 
 * @param setTestCases 
 * @returns 
 */
export default function getMethods(testCases: IntegrationTestCaseT[], setTestCases: React.Dispatch<React.SetStateAction<IntegrationTestCaseT[]>>) {
    /**
     * 执行测试，测试用例从参数传入
     * @param cases 
     */
    async function runTest(cases: IntegrationTestCaseT[]) {
        const _fetch = (_case: IntegrationTestCaseT) => {
            return new Promise((resolve, reject) => {
                const controller = new AbortController()
                const { signal } = controller
                setTimeout(() => {
                    controller.abort()
                    resolve('Timeout')
                }, 5000)
                if (_case.requestMethod === 'GET') {
                    const req = fetch(_case.url, { signal })
                        .then(r => r.json())
                        .catch(() => '')
                    resolve(req)
                }
                if (_case.requestMethod === 'POST') {
                    const req = fetch(_case.url, {
                        method: 'POST',
                        body: JSON.stringify(_case.body),
                        signal,
                        headers: new Headers({
                            'Content-Type': "application/json"
                        })
                    }).then(r => r.json())
                        .catch(() => '')
                    resolve(req)
                    // post(
                    //     _case.url,
                    //     JSON.stringify(_case.body),
                    //     (response) => {
                    //         resolve(JSON.parse(response))
                    //     }
                    // )
                }
            })
        }
        for (let _case of cases) {
            const fetchedData = await _fetch(_case)
            const actualOutput = fetchedData === 'Timeout' ? fetchedData : JSON.stringify(fetchedData)
            _case.actualOutput = actualOutput
            _case.passed = _case.expectOutput === actualOutput
            _case.tested = true
        }
        setTestCases([...testCases])
    }
    /**
     * 测试一条测试用例，用例 key 由参数指定
     * @param key 
     */
    function testOne(key: number) {
        // 清除测试状态
        const newTestCases = JSON.parse(JSON.stringify(testCases)) as IntegrationTestCaseT[]
        newTestCases.forEach(thisCase => {
            if (thisCase.key === key) {
                thisCase.tested = false
                thisCase.actualOutput = ''
            }
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
                const data = JSON.parse(dataString).data as IntegrationTestCaseFileItem[]
                setTestCases(data.map((item, index) => ({
                    key: index,
                    url: item.url,
                    requestMethod: item.requestMethod,
                    body: item.body,
                    expectOutput: JSON.stringify(item.expectOutput),
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
     * 集成测试全部用例
     */
    function testAllCases() {
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
        testOne,
        testCasesFileOnChange,
        testAllCases
    }
}
// function post(url: string, body: string, cb: (response: any) => void) {
//     var xhr = new XMLHttpRequest();
//     //使用HTTP POST请求与服务器交互数据
//     xhr.open("POST", url, true);
//     //设置发送数据的请求格式
//     xhr.setRequestHeader('Content-type', 'application/json');
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === 4) {
//             if (xhr.status === 200) {
//                 cb(xhr.response)
//             }
//         }
//     }
//     xhr.send(body);
// }