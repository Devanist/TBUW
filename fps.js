//Worker wyświetlający w konsoli liczbę klatek na sekundę

self.addEventListener('message', function(e){
    console.log(e.data);
});