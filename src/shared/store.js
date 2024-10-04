import { createStore } from 'vuex';

export default createStore({
    state: {
        propietarioId: null,
    },
    mutations: {
        setPropietarioId(state, propietarioId) {
            state.propietarioId = propietarioId;
        },
        clearPropietarioId(state) {
            state.propietarioId = null;
        },
    },
    actions: {
        iniciarSesion({ commit }, propietarioId) {
            commit('setPropietarioId', propietarioId);
        },
        cerrarSesion({ commit }) {
            commit('clearPropietarioId');
        },
    },
    getters: {
        propietarioId: (state) => state.propietarioId,
    },
});
