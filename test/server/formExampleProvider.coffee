class FormExampleProvider
  constructor: () ->

  sendData: (req, res) =>
    filteredData = data


    if(req.body.firstname)
      filteredData = @filterData filteredData, 'firstname', req.body.firstname

    if(req.body.lastname)
      filteredData = @filterData filteredData, 'lastname', req.body.lastname

    if(req.body.gender)
      filteredData = @filterData filteredData, 'gender', req.body.gender, true

    resultHTML = '<!DOCTYPE html>
                    <html>
                      <head>
	                      <title>Form Testing</title>
                        <meta charset="UTF-8">
                        <meta name="description" content="ajax module testing page">
                        <meta name="author" content="Benjamin Gröner">
                        <link rel="stylesheet" type="text/css" href="dist/css/test.css" media="all" />
                        <script data-main="dist/js/test" src="dist/js/contrib/require.js"></script>
                      </head>
                      <body>
                        <table class="table table-striped">
                          <thead>
                            <tr>
                              <th>First Name</th>
                              <th>Last Name</th>
                              <th>Email</th>
                            </tr>
                          </thead>
                          <tbody id="bJS_formExample-source">'


    for datum in filteredData
      resultHTML += '<tr>
                      <td>' + datum.firstname + '</td>
                      <td>' + datum.lastname + '</td>
                      <td>' + datum.gender + '</td>
                    </tr>'


    resultHTML += '       </tbody>
                        </table>
                      </body>
                    </html>'

    #	Simulate delay through Timeout
    setTimeout () ->
      res.send resultHTML
    , 2000

  filterData: (data, key, value, exactValue) =>
    filteredData = []

    for datum in data
      if (exactValue and datum[key].toLowerCase() is value.toLowerCase()) or (not exactValue and datum[key].match new RegExp(value,"i"))
        filteredData.push datum

    return filteredData



data = [
  {
    "firstname": "Reagan"
    "lastname": "Larson"
    "gender": "male"
  }
  {
    "firstname": "Payton"
    "lastname": "Beck"
    "gender": "male"
  }
  {
    "firstname": "Kayden"
    "lastname": "Gilliam"
    "gender": "female"
  }
  {
    "firstname": "Reagan"
    "lastname": "Larson"
    "gender": "male"
  }
  {
    "firstname": "Alexis"
    "lastname": "Esparza"
    "gender": "male"
  }
  {
    "firstname": "Joss"
    "lastname": "Alfredson"
    "gender": "female"
  }
  {
    "firstname": "Tracy"
    "lastname": "Christinsen"
    "gender": "female"
  }
  {
    "firstname": "Lacy"
    "lastname": "Ureña"
    "gender": "female"
  }
  {
    "firstname": "Shelly"
    "lastname": "Fried"
    "gender": "female"
  }
  {
    "firstname": "Sequoia"
    "lastname": "Blumstein"
    "gender": "female"
  }
  {
    "firstname": "Kevyn"
    "lastname": "Townsend"
    "gender": "male"
  }
  {
    "firstname": "Lindsay"
    "lastname": "Gonzalez"
    "gender": "female"
  }
  {
    "firstname": "Kevyn"
    "lastname": "Townsend"
    "gender": "male"
  }
  {
    "firstname": "Jaylen"
    "lastname": "Drechsler"
    "gender": "female"
  }
  {
    "firstname": "Stacey"
    "lastname": "Bailey"
    "gender": "female"
  }
  {
    "firstname": "Johnnie"
    "lastname": "Breitbarth"
    "gender": "male"
  }
  {
    "firstname": "Charley"
    "lastname": "Cotterill"
    "gender": "male"
  }
  {
    "firstname": "Chus"
    "lastname": "Hass"
    "gender": "male"
  }
  {
    "firstname": "Sidney"
    "lastname": "Monday"
    "gender": "female"
  }
  {
    "firstname": "Chus"
    "lastname": "Gehrig"
    "gender": "male"
  }
  {
    "firstname": "Hadley"
    "lastname": "Pound"
    "gender": "male"
  }
  {
    "firstname": "Meredith"
    "lastname": "Monday"
    "gender": "female"
  }
  {
    "firstname": "Tierney"
    "lastname": "Shine"
    "gender": "male"
  }
  {
    "firstname": "Joyce"
    "lastname": "Breckinridge"
    "gender": "female"
  }
  {
    "firstname": "Shirley"
    "lastname": "Sepúlveda"
    "gender": "female"
  }
  {
    "firstname": "Devyn"
    "lastname": "Buhr"
    "gender": "male"
  }
]

module.exports = FormExampleProvider