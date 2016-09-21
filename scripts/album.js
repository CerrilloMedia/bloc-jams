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

var currentAlbum = [];

var createSongRow = function(songNumber, songName, songLength) {
    var template = '<tr class="album-view-song-item">'
    + '  <td class="song-item-number">' + songNumber + '</td>'
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

window.onload = function() {
    setCurrentAlbum(albumMarconi);
    currentAlbum[0] = albumMarconi;
};

document.getElementsByClassName('album-cover-art')[0].onclick = function() {
    var index = albumsCollection.indexOf(currentAlbum[0]) + 1;
    if (albumsCollection[index] === undefined ) {
        index = 0;
    }
    setCurrentAlbum(albumsCollection[index]);
    currentAlbum[0] = albumsCollection[index];
    
};