async function loadSchools() {
  const response = await fetch('./data/schools.json');
  const schools = await response.json();
  return schools;
}

loadSchools().then(schools => {
  console.log('Loaded', schools.length, 'schools');
});
