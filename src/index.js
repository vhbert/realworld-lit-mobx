import "./pages/Home";
import './app';
import "./pages/Login";
import './components/NavHeader';
import './components/AppFooter';
import './components/ArticlePreview';
import './components/LoadingSpinner';
import './components/FollowButton';
import './components/FavoriteButton';
import './components/DeleteButton';
import './components/EditButton';
import './pages/Profile';
import RootStore from "./stores/rootStore";
import {render, html} from 'lit-html';
import {createRouter} from "./router";

const stores = new RootStore();

render(
  html`<realworld-app .stores=${stores}></realworld-app>`,
  document.getElementById('root')
);

if (process.env.NODE_ENV === 'production') {
  //Disabling the serviceworker in development
  registerSW();
}

const router = createRouter({stores});
router.listen();


async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch {
      console.log("Serviceworker init has failed");
    }
  } else {
    console.log("No serviceworker support found!");
  }
}
