import { Route, Routes } from "react-router-dom"
import { Fragment } from "react/jsx-runtime"
import Home from "../page/Movie"

const RouterMain = () => {
  return (
    <Fragment>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </Fragment>
  )
}

export default RouterMain
