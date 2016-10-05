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
    
    var $row = $(template);
    
    var clickHandler = function() {
        // find the song item number (string) of song row        
        var songNumber = $(this).attr('data-song-number');
        
        if (currentlyPlayingSong !== null) {
            // if another song is already playing, set back to song number
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
		currentlyPlayingCell.html(currentlyPlayingSong);
        }
        
        if (currentlyPlayingSong !== songNumber) {
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSong = songNumber;
        } else if ( currentlyPlayingSong === songNumber ) {
            $(this).html(playButtonTemplate);
            currentlyPlayingSong = null;
        }
    };
        
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number'); // select the node
        var songNumber = songNumberCell.attr('data-song-number'); // select the data from node attribute
        
        // if song-item-number isn't already currentPlayingSong, change to play button        
        if ( songNumber !== currentlyPlayingSong ) {
            songNumberCell.html(playButtonTemplate);
        }
        
    };
    
    var offHover = function(event) {
        
        var songNumberCell = $(this).find('.song-item-number'); // select the node
        var songNumber = songNumberCell.attr('data-song-number'); // select the data from node attribute
        
        if ( songNumber !== currentlyPlayingSong ) {
            songNumberCell.html(songNumber); // Change contents of node
        }
    };
    
    $row.find('.song-item-number').click(clickHandler);    
    $row.hover(onHover, offHover);
    return $row;
};



var setCurrentAlbum = function(album) {
    
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty();
    
    for (var i = 0 ; i < album.songs.length ; i++ ) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
var currentlyPlayingSong = null; // will always be a string value

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    
});

// Cycle Through Albums
$('.album-cover-art').click(function() {
    var index = albumsCollection.indexOf(currentAlbum) + 1;
    if (albumsCollection[index] === undefined ) {
        index = 0;
    }
    currentlyPlayingSong = null;
    setCurrentAlbum(currentAlbum = albumsCollection[index]);
    // currentAlbum[0] = albumsCollection[index];    
});