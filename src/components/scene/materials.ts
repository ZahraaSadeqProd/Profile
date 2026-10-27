import * as THREE from "three";

// Albedo values are chosen for the duotone pass: light surfaces print as bone, shadowed or dark
// surfaces print as green or ink. Hue here is irrelevant; only luminance survives.
export const M = {
  white: new THREE.MeshLambertMaterial({ color: "#f4f4f4" }),
  paper: new THREE.MeshLambertMaterial({ color: "#ffffff" }),
  light: new THREE.MeshLambertMaterial({ color: "#d9d9d9" }),
  mid: new THREE.MeshLambertMaterial({ color: "#8a8a8a" }),
  dark: new THREE.MeshLambertMaterial({ color: "#3a3a3a" }),
  black: new THREE.MeshLambertMaterial({ color: "#141414" }),
  board: new THREE.MeshLambertMaterial({ color: "#6e6e6e" }),
};
