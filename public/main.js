// handle form submit
const form = document.getElementById('vote-form');

form.addEventListener('submit', (e) => {
  const choice = document.querySelector('input[name=os]:checked').value;
  const data = {
    os: choice,
  };
  // var port = process.env.PORT;
  // if (port == null || port == '') {
  //   port = 8000;
  // }

  fetch(`/poll`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

  e.preventDefault();
});

fetch(`/poll`)
  .then((res) => res.json())
  .then((data) => {
    // console.log(data);
    const votes = data.votes;
    const totalVotes = votes.length;

    // count vote points ~ params(accumulator, currentValues)
    const voteCounts = votes.reduce(
      (acc, vote) => (
        (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc
      ),
      {},
    );

    // canvasJS buat chart
    let dataPoints = [
      { label: 'Windows', y: voteCounts.Windows },
      { label: 'MacOS', y: voteCounts.MacOS },
      { label: 'Linux', y: voteCounts.Linux },
      { label: 'Other', y: voteCounts.Other },
    ];
    const chartContainer = document.querySelector('#chartContainer');

    if (chartContainer) {
      const chart = new CanvasJS.Chart('chartContainer', {
        animationEnabled: true,
        theme: 'theme1',
        title: {
          text: `Total Votes: ${totalVotes}`,
        },
        data: [
          {
            type: 'column',
            dataPoints: dataPoints,
          },
        ],
      });

      chart.render();

      // Enable pusher logging - don't include this in production
      Pusher.logToConsole = true;

      var pusher = new Pusher('072bf72ee6b4b87d400a', {
        cluster: 'ap1',
        forceTLS: true,
      });

      var channel = pusher.subscribe('os-poll');
      channel.bind('os-vote', function (data) {
        dataPoints = dataPoints.map((x) => {
          if (x.label == data.os) {
            x.y += data.points;
            return x;
          } else {
            return x;
          }
        });

        chart.render();
      });
    }
  });
