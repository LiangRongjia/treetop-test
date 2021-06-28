import { IntegrationTestCaseT } from '../../interfacesAndTypes'
import { Table } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { CloseCircleTwoTone } from '@ant-design/icons'
import './index.css'

export default function TestCasesTable({ data, testIt }: {
    data: IntegrationTestCaseT[],
    testIt: (key: number) => void
}) {
    const columns = [{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        className: 'font-size-12px',
        align: 'center' as 'center',
        width: 48
    }, {
        title: 'URL',
        key: 'url',
        className: 'font-size-12px',
        render: (item: IntegrationTestCaseT) => (
            <code>{item.url}</code>
        )
    }, {
        title: '请求类型',
        key: 'requestMethod',
        dataIndex: 'requestMethod',
        className: 'font-size-12px',
        align: 'center' as 'center',
        width: 72
    }, {
        title: 'Body',
        key: 'body',
        className: 'font-size-12px',
        render: (item: IntegrationTestCaseT) => (
            item.requestMethod === 'POST'
                ? <code>{JSON.stringify(item.body)}</code>
                : <div>none</div>
        )
    }, {
        title: '预期输出',
        key: 'expectOutput',
        className: 'font-size-12px',
        render: (item: IntegrationTestCaseT) => (
            <code>{item.expectOutput}</code>
        )
    }, {
        title: '实际输出',
        key: 'actualOutput',
        className: 'font-size-12px',
        render: (item: IntegrationTestCaseT) => (
            item.actualOutput !== ''
                ? <code>{item.actualOutput}</code>
                : <div></div>
        )
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
        render: (item: IntegrationTestCaseT) => (
            item.tested
                ? item.passed
                    ? <CheckCircleTwoTone twoToneColor="#52c41a" />
                    : <CloseCircleTwoTone twoToneColor="#ff0000" />
                : <div></div>
        ),
        className: 'font-size-12px',
        align: 'center' as 'center',
        width: 48
    }, {
        title: '测试',
        key: 'test',
        render: (item: IntegrationTestCaseT) => (
            <button
                className="ms-button"
                style={{ fontSize: "12px", display: 'inline-block', padding: '4px', height: 'max-content', margin: '-4px 0px' }}
                onClick={() => testIt(item.key)}>
                测试
            </button>
        ),
        className: 'font-size-12px',
        align: 'center' as 'center',
        width: 64
    }]

    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            size="small"
            sticky />
    )
}