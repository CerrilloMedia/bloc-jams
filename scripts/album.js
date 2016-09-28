var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21' },
        { title: 'Magenta', duration: '2:15' },
    ]
};
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21' },
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15' }
    ]
};
var albumSimpsons = {
    title: 'Go Simpsonic with The Simpsons',
    artist: 'Alf Clausen, Matthias Gohl, Christopher Tyng, Bill Inglot',
    label: 'Rhino Records',
    year: '1999',
    albumArtUrl: 'assets/images/album_covers/23.png',
    songs: [
        { title: 'Kamp Krusty - Theme Song', duration: '1:07' },
        { title: 'A Boozehound Named Barney', duration: '1:55' },
        { title: 'Talkin\' Softball', duration: '1:24' },
        { title: 'Apu in "The Jolly Bengali" Theme', duration: '0:16' },
        { title: 'Poochie Rap Song', duration: '0:30' }
    ]
};

var albumsCollection = [albumPicasso, albumMarconi, albumSimpsons];

var currentAlbum;

var createSongRow = function(songNumber, songName, songLength) {
    var template = '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>';
    
    return template;
};

var setCurrentAlbum = function(album) {
    
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
    
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);
    
    albumSongList.innerHTML = '';
    
    for (var i = 0 ; i < album.songs.length ; i++ ) {
        albumSongList.innerHTML += createSongRow( (i + 1), album.songs[i].title, album.songs[i].duration);
    }
};

var findParentByClassName = function(element, targetClass) {
    var currentParent = element.parentElement;
    if (element) { // check if element exists
        while (currentParent.className != targetClass && currentParent.className !== null) {
            currentParent = currentParent.parentElement;
        }
        return currentParent;
    } 
    
    
};

// Due to element bubbling vs capturing we want to always select the song-item-number from the entire row
function getSongItem(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play': // find item number from within the first cell
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item': // find song item number from within the entire song table row (first and only instance of .song-item-number)
            return element.querySelector('.song-item-number');
        case 'song-item-title': //     find song item number via parent
        case 'song-item-duration': //  then query for child w/ selector (sibling search)
            return findParentByClassName(element,'album-view-song-item').querySelector('.song-item-number');
            // do something
        case 'song-item-number':
            return element;
        default:
            return;
    }
};

var clickHandler = function(targetElement) {
    // find the song item number (string) of song row
    var songItem = getSongItem(targetElement); 
    
    // if no song is playing (begin playing when clicked)
    if (currentPlayingSong == null) { 
        // set the button option from play to pause
        songItem.innerHTML = pauseButtonTemplate;
        // and assign song number to currentPlaying song.
        currentPlayingSong = songItem.getAttribute('data-song-number'); 
        
    } else if (currentPlayingSong === songItem.getAttribute('data-song-number')) { // if song selected is already playing (pause when clicked)
        // change the button option from 'pause' to 'play'
        songItem.innerHTML = pauseButtonTemplate;
        // and set song to null (not currently playing)
        currentPlayingSong = null;                  
    } else if ( currentPlayingSong != songItem.getAttribute('data-song-number') ) {  // revert play/pause button back to track number if not currentPlayingSong
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentPlayingSong + '"]')
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentPlayingSong = songItem.getAttribute('data-song-number');
    }
    
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];

var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
var currentPlayingSong = null; // will always be a string value

window.onload = function() {
    setCurrentAlbum(currentAlbum = albumPicasso);
    
    // MouseOver 
    songListContainer.addEventListener('mouseover', function(event) {        
        if (event.target.parentElement.className === 'album-view-song-item') {
            
            var songItem = getSongItem(event.target);
            
            event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
            
            if ( songItem.getAttribute('data-song-number') !== currentPlayingSong  ) {
                songItem.innerHTML = playButtonTemplate;
                // change the value of the table cell.innerHTML only when it's not the currently playing song
            } /*  else { // included this line so as to show which track was currently playing
                songItem.innerHTML = pauseButtonTemplate;
            } */
        }
    });
    
    for (var i = 0 ; i < songRows.length ; i++) {
        songRows[i].addEventListener('mouseleave', function(event) {
            
            var songItem = getSongItem(event.target); 
            var songItemNumber = songItem.getAttribute('data-song-number');
            
            if (songItemNumber !== currentPlayingSong) {
                songItem.innerHTML = songItemNumber;
            }
            
        });
        
        songRows[i].addEventListener('click', function(event) {
           clickHandler(event.target); // the 'target' is wherever the mouse clicked on
        });
    }
    
};

// Cycle Through Albums
document.getElementsByClassName('album-cover-art')[0].onclick = function() {
    var index = albumsCollection.indexOf(currentAlbum) + 1;
    if (albumsCollection[index] === undefined ) {
        index = 0;
    }
    setCurrentAlbum(currentAlbum = albumsCollection[index]);
    // currentAlbum[0] = albumsCollection[index];    
};