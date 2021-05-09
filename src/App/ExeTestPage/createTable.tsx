import { Table } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { Checkbox } from 'antd'

import { TestCaseT } from './index'

export default function createTable(
    data: TestCaseT[],
    testIt: (key: number) => void,
    checkIt: (key: number) => void) {
    const columns = [{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        className: 'font-size-12px'
    }, {
        title: '输入',
        dataIndex: 'input',
        key: 'input',
        className: 'font-size-12px'
    }, {
        title: '预期输出',
        dataIndex: 'expectOutput',
        key: 'expectOutput',
        className: 'font-size-12px'
    }, {
        title: '实际输出',
        dataIndex: 'actualOutput',
        key: 'actualOutput',
        className: 'font-size-12px'
    }, {
        title: '设计方法',
        dataIndex: 'methodType',
        key: 'methodType',
        className: 'font-size-12px'
    }, {
        title: '备注',
        dataIndex: 'notes',
        key: 'notes',
        className: 'font-size-12px'
    }, {
        title: '通过',
        key: 'passed',
        render: (item: TestCaseT) => (
            item.tested
                ? item.passed
                    ? < CheckCircleTwoTone twoToneColor="#52c41a" />
                    : '未通过'
                : '未测试'
        ),
        className: 'font-size-12px'
    }, {
        title: '勾选',
        key: 'checked',
        render: (item: TestCaseT) => (
            <Checkbox checked={item.checked} onChange={() => checkIt(item.key)}></Checkbox >
        ),
        className: 'font-size-12px'
    }, {
        title: '测试',
        key: 'test',
        render: (item: TestCaseT) => (
            <button
                className="ms-button"
                style={{ fontSize: "12px" }}
                onClick={() => testIt(item.key)}>
                测试
            </button>
        ),
    }]

    return <Table
        columns={columns}
        dataSource={data}
        size="small" />
}