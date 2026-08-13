import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Members from '../views/Members.vue'
import Tree from '../views/Tree.vue'
import GenerationTree from '../views/GenerationTree.vue'
import About from '../views/About.vue'
import PersonDetail from '../views/PersonDetail.vue';

const routes = [
  {
    path: '/',
    component: Home
  },
  {
  path: '/nguoi/:id',
  name: 'person-detail',
  component: PersonDetail
  },
  {
    path: '/members',
    component: Members
  },
  {
    path: '/tree',
    component: Tree
  },
  {
  path: '/generation-tree',
  name: 'generation-tree',
  component: GenerationTree
  },
  {
    path: '/about',
    component: About
  }
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})