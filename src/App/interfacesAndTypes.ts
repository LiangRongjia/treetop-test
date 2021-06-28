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

export interface testCaseFileItem {
    input: string,
    expectOutput: string,
    methodType: string,
    notes: string
}
export type IntegrationTestCaseFileItem = {
    url: string,
    requestMethod: string,
    body: Object,
    expectOutput: Object,
    methodType: string,
    notes: string
}
export type IntegrationTestCaseT = {
    url: string,
    requestMethod: string,
    body: Object,
    expectOutput: string,
    methodType: string,
    notes: string,
    key: number,
    actualOutput: string,
    passed: boolean,
    tested: boolean
}