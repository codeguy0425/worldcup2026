import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Fixtures } from './pages/Fixtures'
import { MatchDetail } from './pages/MatchDetail'
import { Groups } from './pages/Groups'
import { GroupDetail } from './pages/GroupDetail'
import { TopScorers } from './pages/TopScorers'
import { Teams } from './pages/Teams'
import { TeamDetail } from './pages/TeamDetail'
import { StadiumsPage } from './pages/Stadiums'
import { Bracket } from './pages/Bracket'
import { ViuTV } from './pages/ViuTV'
import { More } from './pages/More'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter basename="/worldcup2026">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/match/:id" element={<MatchDetail />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:name" element={<TeamDetail />} />
          <Route path="/top-scorers" element={<TopScorers />} />
          <Route path="/stadiums" element={<StadiumsPage />} />
          <Route path="/bracket" element={<Bracket />} />
          <Route path="/viutv" element={<ViuTV />} />
          <Route path="/more" element={<More />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
