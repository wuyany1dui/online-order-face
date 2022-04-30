import { lazy, Suspense } from 'react';
import App from '../App';
import Loading from '../componments/Loading';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// 路由接口
interface IRoute {
    path: String;
    componment: React.FC;
    children?: IRoute[]
}

// 定义路由接口数组，进行懒加载
const routerArray: IRoute[] = [
    { path: "/", componment: App, children: [{ path: "list", componment: lazy(() => import("../pages/List")) }] },
    { path: "/login", componment: lazy(() => import("../Login")) },
    { path: "/register", componment: lazy(() => import("../Register")) }
]

const MyRouter = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                <Routes>
                    {
                        routerArray.map((item: any, index: any) => {
                            return (
                                item.children ?
                                    <Route key={index} path={item.path} element={<item.componment />}>
                                        {
                                            item.children.map((e: any, i: any) => (
                                                <Route key={i} path={e.path} element={<e.componment />} />
                                            ))
                                        }
                                    </Route>
                                    :
                                    <Route key={index} path={item.path} element={<item.componment />} />
                            )
                        })
                    }
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default MyRouter;