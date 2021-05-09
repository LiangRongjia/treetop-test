import './Nav.css'

interface NavProps {
    tabs: { name: string, component: () => JSX.Element }[]
    currentTab: number,
    goToTab: (to: number) => void
}

export default function Nav({ tabs, currentTab, goToTab }: NavProps) {
    return (
        <nav>
            <ul data-selected-index={currentTab + 1}>
                {
                    tabs.map((tab, idx) => (
                        <li onClick={() => goToTab(idx)} key={idx}>
                            {tab.name}
                        </li>
                    ))
                }
            </ul>
        </nav >
    )
}