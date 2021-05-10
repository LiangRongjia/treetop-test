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