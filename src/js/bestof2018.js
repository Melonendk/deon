const bestOf2018Scope = {}

function processBestOf2018Page () {
  bestOf2018Scope.loading = false
  bestOf2018Scope.data = {
    status: {
      open: true,
      canVote: false,
      canTweet: true
    },
    artists: {
      1: {
        artistName: "Conro",
        songName: "Trippin",
        artistImg: "https://assets.monstercat.com/artists-profile-images/dc2104d1f7e2689b861a7ac0f978493bab653627.jpg?image_width=256",
        albumArt: "https://assets.monstercat.com/releases/covers/Conro%20-%20Trippin%20(Art).jpg?image_width=1024",
        ranking: "1"
      },
      2: {
        artistName: "AU5",
        songName: "Song Name",
        artistImg: "https://assets.monstercat.com/artists-profile-images/9ecb97c287ae0832ac2ef8fef22e0a15f44df80d.jpg?image_width=256",
        albumArt: "https://assets.monstercat.com/releases/covers/b9eENJpwsDfPvTKswD9t%20-%20Au5%20&%20Nytrix%20-%20Only%20in%20a%20Dream%20(Art).jpg?image_width=1024",
        ranking: "2"
      },
      3: {
        artistName: "Justin OH",
        songName: "Loving Her Loving U",
        artistImg: "https://assets.monstercat.com/artists-profile-images/justinoh_monstercat_pressforwebsite.jpg?image_width=256",
        albumArt: "https://assets.monstercat.com/releases/covers/8lERVEfF2jZ4UCA9sGwd%20-%20Justin%20OH%20-%20Loving%20Her,%20Loving%20U%20(Art).jpg?image_width=1024",
        ranking: "3"
      },
      4: {
        artistName: "Grant",
        songName: "The Edge feat. Nevve",
        artistImg: "https://assets.monstercat.com/artists-profile-images/a6b2ddbf085be7f86c0cc212243f3e967e36e5da.jpg?image_width=256",
        albumArt: "https://assets.monstercat.com/releases/covers/AzpmAEpKkyfUUYZc1JE4%20-%20Grant%20-%20The%20Edge%20(feat.%20Nevve)%20(Art).jpg?image_width=1024",
        ranking: "4"
      }
    }
  }
  renderContent('best-of-2018', bestOf2018Scope)
}
