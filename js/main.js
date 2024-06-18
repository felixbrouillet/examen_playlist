import { createApp, ref, computed } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

const page_active = ref("accueil")
const texte_recherche = ref("")
const infos_chanson = ref([])
const chanson_active = ref("")
const params = ref(null)
const balise_audio = ref(null)
const volume = ref(1) // Initial volume level (range: 0 to 1)
const progress = ref(0) // Current song progress (range: 0 to 100)


// Changer de l'accueil vers la liste de chansons --------------------------------------------------------------
function changerPage(nom_page) {
  page_active.value = nom_page
}


// fetch les chansons et informations à partir du json------------------------------------------------------------------
fetch("chansons/chansons.json")
  .then(resp => resp.json())
  .then(fichier => {
    infos_chanson.value = fichier.infos_chanson
  })

  // creer un template pour la durée des chansons ---------------------------------------------------------------
function convertirDuree(dureeTotale) {
  var minutes = Math.floor(dureeTotale / 60);
  var secondes = dureeTotale % 60;
  var minutesFormattees = minutes < 10 ? "0" + minutes : minutes;
  var secondesFormattees = secondes < 10 ? "0" + secondes : secondes;
  var dureeFormattee = minutesFormattees + ":" + secondesFormattees;
  return dureeFormattee;
}

// fonction pour les recherches -----------------------------------------------------------------------------------
function filtrer(infos_chanson) {
  const chansons_filtres = infos_chanson.filter(chanson => {
    const titre = chanson.titre.toLowerCase()
    const artiste = chanson.artiste.toLowerCase()
    const recherche = texte_recherche.value.toLowerCase()
    return titre.includes(recherche) || artiste.includes(recherche)
  })
  return chansons_filtres
}

// faire jouer une chansons et afficher ses informations ------------------------------------------------------------------------
function changerChanson(nom_chanson, params_chanson = null) {
  chanson_active.value = nom_chanson
  params.value = params_chanson
}


// controles play/pause, son, barre de progres ----------------------------------------------------------------------------
function toggleJouer() {
  if (balise_audio.value.paused) {
    balise_audio.value.play()
  } else {
    balise_audio.value.pause()
  }
}

function controlVolume(volumeLevel) {
  volume.value = volumeLevel
  balise_audio.value.volume = volumeLevel
}

function updateProgress() {
  const currentTime = balise_audio.value.currentTime
  const duration = balise_audio.value.duration
  progress.value = (currentTime / duration) * 100
}


// note : "mounted" ici et "computed" tout en haut du projet, j'ai trouvé que cela fonctionne sans trop savoir pourquoi mais je l'ai ajouté au projet pour la barre de progression.

createApp({
  setup() {
    return {
      infos_chanson,
      page_active,
      texte_recherche,
      chanson_active,
      params,
      balise_audio,
      volume,
      progress: computed(() => progress.value.toFixed(2)),
      convertirDuree,
      changerPage,
      filtrer,
      changerChanson,
      toggleJouer,
      controlVolume,
      updateProgress
    }
  },
  mounted() {
    balise_audio.value = this.$refs.balise_audio;
  }
}).mount("#app");
