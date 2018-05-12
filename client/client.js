
// Hits the server interface for opening up a new Twitter stream
function fetchSocket (params) {

  // Assembles URL
  let url = ['/api/tweets', '?', Qs.stringify(params)].join('')

  // Returns a Promise to manage async behavior
  return new Promise((resolve, reject) => {
    fetch(url)
    .then((response) => { return response.json() })
    .then((response) => { return resolve(response) })
    .catch((err) => { return reject(err) })
  })

}

// // // //
// VueJS Components & Application

// Layout Component definition
Vue.component('app-layout', {
  template: `
    <div class='row'>

      <div class='col-sm-12'>
      </div>

      <div class='col-sm-12'>
        <div class='row'>
          <div class='col-sm-8'>
            <h2>
              Frontend CLIs
            </h2>
          </div>
          <div class='col-sm-4 text-right'>
          </div>
        </div>

        <hr class='border-light' />

      </div>

    </div>
  `,
  data () {
    return {
      tweets: [],
      fetching: false,
      params: {
        count: null,
        search: ''
      }
    }
  },
  methods: {

    // Opens Socket to server
    fetchSocket () {

      // Sets this.fetching to true
      this.fetching = true;

      // Flushes old tweets currently in the UI
      this.tweets = [];

      // Sends the Tweets query to the server
      return fetchSocket(this.params)
      .then((resp) => {

        // Sets this.fetching to false
        this.fetching = false;

        console.log('DONE FETCH')
      })
      .catch((err) => {
        this.coords.error = true;
      })
    }
  }
});
