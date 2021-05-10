import { TestCaseT } from '../../interfacesAndTypes'
import { Table } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { CloseCircleTwoTone } from '@ant-design/icons'
import './index.css'

export default function TestCasesTable({ data, testIt }: {
    data: TestCaseT[],
    testIt: (key: number) => void
}) {

    const columns = [{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        className: 'font-size-12px',
        align: 'center' as 'center'
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
                    : <CloseCircleTwoTone twoToneColor="#ff0000" />
                : <div></div>
        ),
        className: 'font-size-12px',
        align: 'center' as 'center'
    }, {
        title: '测试',
        key: 'test',
        render: (item: TestCaseT) => (
            <button
                className="ms-button"
                style={{ fontSize: "12px", display: 'inline-block' }}
                onClick={() => testIt(item.key)}>
                测试
            </button>
        ),
        className: 'font-size-12px',
        align: 'center' as 'center'
    }]

    return (
        <Table
            className="exe-java-test-page-table"
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            size="small"
            scroll={{ y: 'max-content' }} />
    )
}