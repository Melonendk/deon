const bestOf2018Scope = {}

function processBestOf2018Page () {
  bestOf2018Scope.data = {
    status: {
      open: true,
      hasVoted: true,
      hasVotedAlbumArt: true,
      hasTweeted: true,
      isSignedIn: isSignedIn(),
      votingCloseTime: "x"
    },
    artists: {
      1: {
        artistName: "Conro",
        songName: "Trippin",
        artistImg: "https://assets.monstercat.com/artists-profile-images/dc2104d1f7e2689b861a7ac0f978493bab653627.jpg?image_width=256",
        albumArt: "https://assets.monstercat.com/releases/covers/Conro%20-%20Trippin%20(Art).jpg?image_width=1024",
        ranking: "1",
        votes: 5,
        top: true,
      },
      2: {
        artistName: "AU5",
        songName: "Song Name",
        artistImg: "https://assets.monstercat.com/artists-profile-images/9ecb97c287ae0832ac2ef8fef22e0a15f44df80d.jpg?image_width=256",
        albumArt: "https://assets.monstercat.com/releases/covers/b9eENJpwsDfPvTKswD9t%20-%20Au5%20&%20Nytrix%20-%20Only%20in%20a%20Dream%20(Art).jpg?image_width=1024",
        ranking: "2",
        votes: 5,
      },
      3: {
        artistName: "Justin OH",
        songName: "U & ME",
        artistImg: "https://assets.monstercat.com/artists-profile-images/justinoh_monstercat_pressforwebsite.jpg?image_width=256",
        albumArt: "https://assets.monstercat.com/releases/covers/Gpy7BfepixglUXmPqdv8%20-%20Justin%20OH%20-%20U&ME%20(Art).jpg?image_width=1024",
        ranking: "3",
        votes: 3,
      },
      4: {
        artistName: "Grant",
        songName: "The Edge feat. Nevve",
        artistImg: "https://assets.monstercat.com/artists-profile-images/a6b2ddbf085be7f86c0cc212243f3e967e36e5da.jpg?image_width=256",
        albumArt: "https://assets.monstercat.com/releases/covers/AzpmAEpKkyfUUYZc1JE4%20-%20Grant%20-%20The%20Edge%20(feat.%20Nevve)%20(Art).jpg?image_width=1024",
        ranking: "4",
        votes: 2,
      },
    },
    artistOptions: bestof2018data.parentOptions
  }
  renderContent('best-of-2018', bestOf2018Scope)
  renderContent('best-of-2018-results', bestOf2018Scope)
}

function filterBestOf2018Artists(e, input){
  const filterSearch = filterNormalize(findNode('[role="artist-filter"]').value)
  const artistRows = findNodes('.bestof2018-search-result')
  let count = 0

  artistRows.forEach((row)=>{
    if (row.id == "bestof2018-no-results") {
      return
    }
    const nameEl = row.querySelector('.artist-name-search')
    const name = filterNormalize(nameEl.innerText)
    const found = name.indexOf(filterSearch) >= 0

    row.classList.toggle('hide', !found)
    if (found) {
      count++
    }
  })
  findNode("#bestof2018-no-results").classList.toggle('hide', count)
}

function openAddArtistTrack (e, el, rank) {
  e.preventDefault()
  const template = 'add-artist-track'
  const key = el.dataset.pollId
  const x = bestof2018data.childOptions[key]

  if (!x) {
    toasty(Error('An error occurred, there was an issue with the poll.'))
    return
  }
  openModal(template, {
    "options": x,
    "pollId": key,
    "position": rank,
  })
}

function onSubmitArtistTrack(e, el) {
  e.preventDefault()
  var fd = new FormData(el)
  var artistInfo = bestof2018data.parentOptions.find(x => x._id == fd.get('parentId'))
  var trackInfo = bestof2018data.childOptions[artistInfo._id].find(x => x._id == fd.get('pollTrackId'))
  var parent = findNode('#bestof2018-picks')
  var example = findNode('.example-row')
  var rank = parseInt(fd.get("position")) || parent.childElementCount

  var li = render('bestof2018-row', {
    artistName: artistInfo.title,
    songName: trackInfo.title,
    artistImg: artistInfo.image,
    albumArt: trackInfo.image,
    ranking: rank,
    _id: artistInfo._id,
  })

  if (fd.has("position")){
    // offset by one because of example li
    parent.children[rank].replaceWith(li.firstElementChild)
    toasty("Updated track.")
  }
  else {
    parent.appendChild(li.firstElementChild)
    example.classList.toggle('hide', true)
    toasty("Added artist track.")
  }
  closeModal()
}

function onRemoveArtist(e, el){
  e.preventDefault()
  if (confirm("Remove artist from your list?")){
    const artistLi = findParentWith(e.target, 'li')
    const parent = artistLi.parentElement

    artistLi.parentElement.removeChild(artistLi)
    toasty("Removed artist from list.")
    if (parent.childElementCount == 1) {
      findNode('.example-row').classList.toggle('hide', false)
    }
  }
}
