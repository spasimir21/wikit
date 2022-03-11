import { inject, reactive } from 'vue';

interface ApplicationState {
  token?: {
    raw: string;
    data: {
      uuid: string;
      username: string;
      iat: number;
      exp: number;
    };
  };
  refreshToken?: string;
}

const LOCAL_STORAGE_STATE_KEY = '$STATE';
const VUE_STATE_KEY = Symbol();

function loadState(_default: ApplicationState): ApplicationState {
  const item = localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
  return item ? JSON.parse(item) : _default;
}

function saveState() {
  localStorage.setItem(LOCAL_STORAGE_STATE_KEY, JSON.stringify(STATE));
}

function useState(): ApplicationState {
  return inject(VUE_STATE_KEY) as ApplicationState;
}

const STATE = reactive<ApplicationState>(loadState({}));

export { STATE, VUE_STATE_KEY, saveState, useState };
