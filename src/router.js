import {Router} from 'slick-router';
import {wc} from 'slick-router/middlewares/wc';
import {routerLinks, withRouterLinks} from 'slick-router/middlewares/router-links';

let router;

export function createRouter({stores}) {

  const routes = [

    {name: 'home', component: () => import( /* webpackChunkName: "home" */ "./pages/Home.js"), path: ''},
    {name: 'login', component: () => import( /* webpackChunkName: "login" */ "./pages/Login.js"), path: '/login'},
    {
      name: 'register',
      component: () => import( /* webpackChunkName: "register" */  "./pages/Login.js"),
      path: '/register'
    },
    {
      name: 'editor',
      component: () => import( /* webpackChunkName: "editor" */    "./pages/Editor"),
      path: '/editor/:slug?',
      beforeEnter: () => stores.authStore.clearErrors()
    },
    {
      name: 'settings',
      path: '/settings',
      component: () => import( /* webpackChunkName: "settings" */   "./pages/Settings"),
      beforeEnter: transition => {
        if (!stores.authStore.activeUser) {
          return transition.redirectTo('login');
        }
      }
    },
    {
      name: 'article',
      component: () => import( /* webpackChunkName: "article" */   "./pages/Article"),
      path: 'article/:slug'
    },

    {
      name: 'profile',
      component: () => import( /* webpackChunkName: "profile" */     "./pages/Profile"),
      beforeEnter: () => {
        stores.profileStore.setActiveProfile({});
      },

      path: '/profile/:username',
      children: [
        {
          name: 'profile.favorites',
          path: 'favorites',
        }
      ]
    }
  ];

  const theRouter = new Router({routes, outlet: 'router-slot', log: false});
  theRouter.use(wc);
  theRouter.use(routerLinks);
  router = theRouter;
  return theRouter;
}


export {router, withRouterLinks};
