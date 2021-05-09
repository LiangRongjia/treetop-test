import './App.css'
import Nav from './Nav/Nav'
import TitleBar from './TitleBar/TitleBar'

import { useState } from 'react';
import ExeTestPage from './ExeTestPage'
import JavaTestPage from './JavaTestPage'

const tabs = [{
  name: 'exe 测试',
  component: ExeTestPage
}, {
  name: 'Java 测试',
  component: JavaTestPage
}]

const getEventsHandle = ({ setCurrentTab }: { setCurrentTab: React.Dispatch<React.SetStateAction<number>> }) => {
  return {
    goToTab: (tabIndex: number) => setCurrentTab(tabIndex)
  }
}

export default function App() {

  const [currentTab, setCurrentTab] = useState(0)

  const { goToTab } = getEventsHandle({ setCurrentTab })

  return (
    <div className="App">
      <TitleBar />
      <Nav tabs={tabs} currentTab={currentTab} goToTab={goToTab} />
      <div className="tab-container">
        {
          tabs.filter((tab, idx) => idx === currentTab)
            .map(tab =>
              <tab.component />
            )
        }
      </div>
    </div>
  )
}
