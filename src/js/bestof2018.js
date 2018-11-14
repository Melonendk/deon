const BESTOF2018_POLLID = '5beb1ee1392fadc053274d59'
const BESTOF2018_ART_POLLID = '581929beb18f478110e6fcb7'

const pollEndpoint = endpoint //'http://localhost:4002'

const PAGE_BESTOF2018 = 'page-best-of-2018'

function processBestOf2018ResultsPage (args) {
  const scope = {
    loading: true,
    error: null
  }

  renderContent('best-of-2018-results', scope)

  request({
    url: endpoint + '/doublepoll/' + BESTOF2018_POLLID + '/results',
    withCredentials: true
  }, (err, result) => {
    scope.loading = false

    if (err) {
      scope.error = err
    }
    else {
      scope.data = result

      if (result.breakdown.status.hasVoted) {
        const tweet = getVotedForTweet(result.breakdown)
        scope.data.tweetUrl = getVotedForTweetIntentUrl(tweet)
      }
    }

    renderContent('best-of-2018-results', scope)
  })
}


function getVotedForTweetIntentUrl (tweet) {
  return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweet);
}

function getVotedForTweet (breakdown) {
  if(!breakdown.status.hasVoted) {
    return false
  }

  let usernames = breakdown.parentOptions.map((opt) => {
    return opt.meta.twitterName.split(' + ').join('+')
  })

  usernames = usernames.splice(0, 9)

  var tweet = 'My @Monstercat Best of 2018 artists are ' + usernames.join(',')

  var link = 'https://monstercat.com/bestof2018';
  if(tweet.length + link.length < 281) {
    tweet += ' ' + link;
  }

  var hashtag = ' #McatBestof2018'
  if(tweet.length + hashtag.length <= 280) {
    tweet += hashtag;
  }

  return tweet;
}

function processBestOf2018ArtPage () {
  const scope = {
    loading: true
  }

  renderContent('best-of-2018-art', scope)

  request({
    method: 'GET',
    url: endpoint + '/poll/' + BESTOF2018_ART_POLLID + '/breakdown',
    withCredentials: true
  }, (err, result) => {
    scope.loading = false
    
    /*
    err = null
    result = {
      poll: {
        choices: [
          "https://assets.monstercat.com/releases/covers/Aero Chord - Shadows (feat. Nevve) (Art).jpg",
          "https://assets.monstercat.com/releases/covers/Aero Chord - Shadows (feat. Nevve) (Art).jpg",
          "https://assets.monstercat.com/releases/covers/Aero Chord - Shadows (feat. Nevve) (Art).jpg",
          "https://assets.monstercat.com/releases/covers/Aero Chord - Shadows (feat. Nevve) (Art).jpg",
          "https://assets.monstercat.com/releases/covers/Aero Chord - Shadows (feat. Nevve) (Art).jpg",
          "https://assets.monstercat.com/releases/covers/Aero Chord - Shadows (feat. Nevve) (Art).jpg",
        ]
      }
    }
    */

    if (err) {
      scope.error = err
      scope.data = null
    }
    else {
      scope.data = result
      scope.data.choices = result.poll.choices.map((choice, index) => {
        return {
          albumArt: choice,
          index: index
        }
      })
    }

    renderContent('best-of-2018-art', scope)
  })
}

function processBestOf2018Page () {
  const scope = {
    loading: true,
    error: null,
  }

  renderContent('best-of-2018', scope)

  request({
    url: endpoint + '/doublepoll/5beb1ee1392fadc053274d59',
    withCredentials: true
  }, (err, result) => {
    scope.loading = false

    if (err) {
      scope.error = err
      scope.data = {}
    }
    else {
      const status = result.status
      const artistOptions = result.parentOptions.map((option) => {
        return option
      })

      scope.data = result
      scope.data.isSignedIn = isSignedIn()
      scope.data.artistOptions = artistOptions
      scope.data.status.open = status.started && !status.ended
    }

    cache(PAGE_BESTOF2018, scope)
    renderContent('best-of-2018', scope)
  })
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
  const picksEl = findNode('#bestof2018-picks')
  const template = 'add-artist-track'
  const key = el.dataset.optionId

  const bestof2018scope = cache(PAGE_BESTOF2018)

  const options = bestof2018scope.data.childOptions[key]

  if (!options) {
    toasty(Error('An error occurred, there was an issue with the poll.'))
    return
  }

  for (var i = 0; i < picksEl.childElementCount; i++) {
    if (picksEl.children[i].classList.contains(key)) {
      return toasty(Error("You have already selected this artist."))
    }
  }

  openModal(template, {
    "options": options,
    "optionId": key,
    "position": rank,
  })
}

function onSubmitArtistTrack(e, el) {
  e.preventDefault()
  var fd = new FormData(el)
  const parentOptionId = fd.get('parentId')
  const childOptionId = fd.get('pollTrackId')

  const bestof2018scope = cache(PAGE_BESTOF2018)
  const bestof2018data = bestof2018scope.data

  var artistOption = bestof2018data.parentOptions.find((parentOption) => {
    return parentOption._id == parentOptionId
  })

  if (!artistOption) {
    toasty(Error('Could not find artist info'))
    return
  }

  var trackOption = bestof2018data.childOptions[artistOption._id].find((option) =>{
    return option._id == childOptionId
  })

  var picksEl = findNode('#bestof2018-picks')
  var example = findNode('.example-row')
  var rank = parseInt(fd.get("position")) || picksEl.childElementCount

  var li = render('bestof2018-row', {
    artistName: artistOption.title,
    songName: trackOption.title,
    artistImg: artistOption.image,
    albumArt: trackOption.image,
    ranking: rank,
    _id: artistOption._id,
    parentOptionId: artistOption._id,
    childOptionId: trackOption._id
  })

  if (fd.has("position")){
    // offset by one because of example li
    picksEl.children[rank].replaceWith(li.firstElementChild)
    toasty("Updated track.")
  }
  else {
    picksEl.appendChild(li.firstElementChild)
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

function clickSubmitBestOf2018 (e) {
  const picksEl = findNode('#bestof2018-picks')
  let data = formToObject(picksEl)

  data = fixFormDataIndexes(data, ['parentOptionIds', 'childOptionIds'])

  if (!data.parentOptionIds.length) {
    toasty(Error('No artists selected'))
    return
  }

  request({
    method: 'POST',
    url:  endpoint + '/doublepoll/' + BESTOF2018_POLLID + '/vote',
    data: {
      parentOptions: data.parentOptionIds,
      childOptions: data.childOptionIds
    },
    withCredentials: true
  }, (err, result) => {
    if (err) {
      toasty(new Error(err))
      return
    }
    toasty('Success!')
    go('/best-of-2018-art')
  })
}

function submitBestOf2018AlbumArt (event) {
  submitForm(event, {
    method: 'POST',
    url: endpoint + '/vote',
    transformData: (data) => {
      data.pollId = BESTOF2018_ART_POLLID
      data.choices = [data.choice]
      return data
    },
    success: () => {
      toasty('Vote submitted')
      go('/best-of-2018/results')
    }
  })
}
