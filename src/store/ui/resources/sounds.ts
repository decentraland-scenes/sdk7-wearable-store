import { AudioSource, engine } from '@dcl/sdk/ecs'

const lobbyMusicClip = 'sounds/lobby_music.mp3'
export const lobbyMusicSource = engine.addEntity()
AudioSource.create(lobbyMusicSource, {
  audioClipUrl: lobbyMusicClip,
  volume: 1
})

const lobbyAmbienceClip = 'sounds/lobby_ambience.mp3'
export const lobbyAmbienceSource = engine.addEntity()
AudioSource.create(lobbyAmbienceSource, {
  audioClipUrl: lobbyAmbienceClip,
  volume: 1
})

const menuUpClip = 'sounds/menu_woosh_up.mp3'
export const menuUpSource = engine.addEntity()
AudioSource.create(menuUpSource, {
  audioClipUrl: menuUpClip,
  volume: 1
})

const menuDownClip = 'sounds/menu_woosh.mp3'
export const menuDownSource = engine.addEntity()
AudioSource.create(menuDownSource, {
  audioClipUrl: menuDownClip,
  volume: 1
})

const menuScrollEndClip = 'sounds/menu_scroll_end.mp3'
export const menuScrollEndSource = engine.addEntity()
AudioSource.create(menuScrollEndSource, {
  audioClipUrl: menuScrollEndClip,
  volume: 1
})

const menuSelectClip = 'sounds/menu_select.mp3'
export const menuSelectSource = engine.addEntity()
AudioSource.create(menuSelectSource, {
  audioClipUrl: menuSelectClip,
  volume: 1
})

const menuDeselectClip = 'sounds/menu_deselect.mp3'
export const menuDeselectSource = engine.addEntity()
AudioSource.create(menuDeselectSource, {
  audioClipUrl: menuDeselectClip,
  volume: 1
})

const refreshSuccessClip = 'sounds/refresh.mp3'
export const refreshSource = engine.addEntity()
AudioSource.create(refreshSource, {
  audioClipUrl: refreshSuccessClip,
  volume: 1
})

const menuErrorClip = 'sounds/menu_error.mp3'
export const menuErrorSource = engine.addEntity()
AudioSource.create(menuErrorSource, {
  audioClipUrl: menuErrorClip,
  volume: 0.8
})

const beamChargeClip = 'sounds/beam_charge.mp3'
export const beamChargeSource = engine.addEntity()
AudioSource.create(beamChargeSource, {
  audioClipUrl: beamChargeClip,
  volume: 0.8
})

const beamFireClip = 'sounds/beam_fire.mp3'
export const beamFireSource = engine.addEntity()
AudioSource.create(beamFireSource, {
  audioClipUrl: beamFireClip,
  volume: 0.8
})

const beamFallClip = 'sounds/beam_fall.mp3'
export const beamFallSource = engine.addEntity()
AudioSource.create(beamFallSource, {
  audioClipUrl: beamFallClip,
  volume: 0.8
})

const impactHardClip = 'sounds/impact_hard.mp3'
export const impactHardSource = engine.addEntity()
AudioSource.create(impactHardSource, {
  audioClipUrl: impactHardClip,
  volume: 0.8
})
