import { reactive } from 'vue'
import type { IDrawStampConfig } from '../DrawStampTypes'

type StampStoreState = {
  config: IDrawStampConfig | null
}

const stampState = reactive<StampStoreState>({
  config: null
})

export function useStampStore() {
  const setConfig = (config: IDrawStampConfig | null) => {
    stampState.config = config
  }

  const updateConfig = (updater: (config: IDrawStampConfig) => void) => {
    if (stampState.config) {
      updater(stampState.config)
    }
  }

  return {
    state: stampState,
    setConfig,
    updateConfig
  }
}

export function __getStampState() {
  return stampState
}

