// Configurar Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAy8UYy6T6QOnfZCAcjAxVHdvTBhM2Rh7",
    authDomain: "ciudades-1e537.firebaseapp.com",
    projectId: "ciudades-1e537",
    storageBucket: "ciudades-1e537.appspot.com",
    messagingSenderId: "741256390813",
    appId: "1:741256390813:web:b22e63228c43b4d98c4c74"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById('city-form').addEventListener('submit', addCity);

function addCity(e) {
    e.preventDefault();
    
    const cityName = document.getElementById('city-name').value;
    const country = document.getElementById('country').value;
    const bestMonth = document.getElementById('best-month').value;
    
    if (cityName && country && bestMonth) {
        const city = {
            name: cityName,
            country: country,
            bestMonth: bestMonth,
            visited: false
        };
        
        db.collection('cities').add(city).then(() => {
            renderCity(city);
            document.getElementById('city-form').reset();
        });
    }
}

function renderCity(city) {
    const cityList = document.getElementById('city-list');
    const li = document.createElement('li');
    
    li.innerHTML = `
        ${city.name} (${city.country}) - Mejor mes: ${city.bestMonth}
        <div>
            <button class="visitado">Visitado</button>
            <button class="eliminar">Eliminar</button>
        </div>
    `;
    
    cityList.appendChild(li);
    
    li.querySelector('.visitado').addEventListener('click', () => markAsVisited(city, li));
    li.querySelector('.eliminar').addEventListener('click', () => deleteCity(city, li));
}

function markAsVisited(city, li) {
    db.collection('cities').doc(city.id).update({ visited: true });
    li.style.textDecoration = 'line-through';
}

function deleteCity(city, li) {
    db.collection('cities').doc(city.id).delete();
    li.remove();
}

// Cargar las ciudades desde Firebase al cargar la página
window.onload = function() {
    db.collection('cities').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const city = doc.data();
            city.id = doc.id;
            renderCity(city);
        });
    });
};
