import Cookies from 'js-cookie';
import { ProjectService, OrganizationService, ProductTypeService } from '@/api/services';

const $project = new ProjectService();
const $organization = new OrganizationService();
const $producttype = new ProductTypeService();

const state = {
    sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
        withoutAnimation: false
    },
    device: 'desktop',
    size: Cookies.get('size') || 'medium',
    projects: JSON.parse(localStorage.getItem('projects') || '[]'),
    organizations: JSON.parse(localStorage.getItem('organizations') || '[]'),
    productTypes: JSON.parse(localStorage.getItem('productTypes') || '[]'),
}

const mutations = {
    TOGGLE_SIDEBAR: state => {
        state.sidebar.opened = !state.sidebar.opened
        state.sidebar.withoutAnimation = false
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', 1)
        } else {
            Cookies.set('sidebarStatus', 0)
        }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
        Cookies.set('sidebarStatus', 0)
        state.sidebar.opened = false
        state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
        state.device = device
    },
    SET_SIZE: (state, size) => {
        state.size = size
        Cookies.set('size', size)
    },
    SET_PROJECTS: (state, projects) => {
        state.projects = projects;
        localStorage.setItem('projects', JSON.stringify(projects));
    },
    SET_ORGANIZATIONS: (state, orgs) => {
        state.organizations = orgs;
        localStorage.setItem('organizations', JSON.stringify(orgs));
    },
    SET_PRODUCT_TYPES: (state, nodes) => {
        state.productTypes = nodes;
        localStorage.setItem('productTypes', JSON.stringify(nodes));
    }
}

const actions = {
    toggleSideBar({ commit }) {
        commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
        commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
        commit('TOGGLE_DEVICE', device)
    },
    setSize({ commit }, size) {
        commit('SET_SIZE', size)
    },
    setProjects({ commit }, projects) {
        commit('SET_PROJECTS', projects);
    },
    setOrganizations({ commit }, orgs) {
        commit('SET_ORGANIZATIONS', orgs);
    },
    setProductTypes({ commit }, nodes) {
        commit('SET_PRODUCT_TYPES', nodes);
    },

    // 获取项目信息
    GetProjects({ commit, state }) {
        return new Promise((resolve, reject) => {
            $project.get().then(res => {
                const data = res.rows;
                commit('SET_PROJECTS', data);
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取组织分组信息
    GetOrganizations({ commit, state }) {
        return new Promise((resolve, reject) => {
            $organization.treeselect().then(res => {
                const data = res.data;
                commit('SET_ORGANIZATIONS', data);
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**
     * 获取产品类型
     * @param {*} param0 
     */
    GetProductTypes({ commit, state }) {
        return new Promise((resolve, reject) => {
            $producttype.get().then(res => {
                const data = res.rows;
                commit('SET_PRODUCT_TYPES', rows);
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
