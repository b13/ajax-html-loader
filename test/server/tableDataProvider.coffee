
class TableDataProvider
  constructor: () ->

  sendTableData: (req, res) ->
	  dataToSend = {}

	  if req.method is 'GET'
	    pageIndex = req.query.page
    else
		  pageIndex = req.body.page

    if pageIndex
      pageIndex = parseInt pageIndex

	    if pageIndex >= 0 and pageIndex < tableData.length
		    dataToSend = tableData[pageIndex]

    setTimeout () ->
        res.send dataToSend
      , 2000



tableData = [
  '<table class="table table-striped">
			<thead>
				<tr>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Email</th>
				</tr>
			</thead>
			<tbody id="bJS_ahl-paginationTest-source">
				<tr>
					<td>Reagan</td>
					<td>Larson</td>
					<td>R.Larson@gmail.com</td>
				</tr>
				<tr>
					<td>Payton</td>
					<td>Beck</td>
					<td>p.beck@gmail.com</td>
				</tr>
				<tr>
					<td>Kayden</td>
					<td>Gilliam</td>
					<td>k.gilliam@gmail.com</td>
				</tr>
				<tr>
					<td>Alexis</td>
					<td>Esparza</td>
					<td>a.esparza@gmail.com</td>
				</tr>
				<tr>
					<td>Evelyn</td>
					<td>Michaels</td>
					<td>e.michaels@gmail.com</td>
				</tr>
			</tbody>
		</table>'

  '<table class="table table-striped">
			<thead>
				<tr>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Email</th>
				</tr>
			</thead>
			<tbody id="bJS_ahl-paginationTest-source">
				<tr>
					<td>Joss</td>
					<td>Alfredson</td>
					<td>j.alfredson@gmail.com</td>
				</tr>
				<tr>
					<td>Tracy</td>
					<td>Christinsen</td>
					<td>t.Christinsen@gmail.com</td>
				</tr>
				<tr>
					<td>Lacy</td>
					<td>Ureña</td>
					<td>l.urena@gmail.com</td>
				</tr>
				<tr>
					<td>Shelly</td>
					<td>Fried</td>
					<td>s.fried@gmail.com</td>
				</tr>
				<tr>
					<td>Sequoia</td>
					<td>Blumstein</td>
					<td>s.blumstein@gmail.com</td>
				</tr>
			</tbody>
		</table>'

  '<table class="table table-striped">
			<thead>
				<tr>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Email</th>
				</tr>
			</thead>
			<tbody id="bJS_ahl-paginationTest-source">
				<tr>
					<td>Kevyn</td>
					<td>Townsend</td>
					<td>k.townsend@gmail.com</td>
				</tr>
				<tr>
					<td>Lindsay</td>
					<td>Gonzalez</td>
					<td>l.gonzalez@gmail.com</td>
				</tr>
				<tr>
					<td>Jaylen</td>
					<td>Drechsler</td>
					<td>j.drechsler@gmail.com</td>
				</tr>
				<tr>
					<td>Stacey</td>
					<td>Bailey</td>
					<td>s.bailey@gmail.com</td>
				</tr>
				<tr>
					<td>Johnnie</td>
					<td>Breitbarth</td>
					<td>j.breitbarth@gmail.com</td>
				</tr>
			</tbody>
		</table>'

  '<table class="table table-striped">
			<thead>
				<tr>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Email</th>
				</tr>
			</thead>
			<tbody id="bJS_ahl-paginationTest-source">
				<tr>
					<td>Charley</td>
					<td>Cotterill</td>
					<td>c.cotterill@gmail.com</td>
				</tr>
				<tr>
					<td>Chus</td>
					<td>Hass</td>
					<td>c.hass@gmail.com</td>
				</tr>
				<tr>
					<td>Sidney</td>
					<td>Monday</td>
					<td>s.monday@gmail.com</td>
				</tr>
				<tr>
					<td>Chus</td>
					<td>Gehrig</td>
					<td>c.gehrig@gmail.com</td>
				</tr>
				<tr>
					<td>Hadley</td>
					<td>Pound</td>
					<td>h.pound@gmail.com</td>
				</tr>
			</tbody>
		</table>'

  '<table class="table table-striped">
			<thead>
				<tr>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Email</th>
				</tr>
			</thead>
			<tbody id="bJS_ahl-paginationTest-source">
				<tr>
					<td>Meredith</td>
					<td>Monday</td>
					<td>m.monday@gmail.com</td>
				</tr>
				<tr>
					<td>Tierney</td>
					<td>Shine</td>
					<td>t.shine@gmail.com</td>
				</tr>
				<tr>
					<td>Joyce</td>
					<td>Breckinridge</td>
					<td>j.breckinridge@gmail.com</td>
				</tr>
				<tr>
					<td>Shirley</td>
					<td>Sepúlveda</td>
					<td>s.sepulveda@gmail.com</td>
				</tr>
				<tr>
					<td>Devyn</td>
					<td>Buhr</td>
					<td>d.buhr@gmail.com</td>
				</tr>
			</tbody>
		</table>'
]

module.exports = TableDataProvider

