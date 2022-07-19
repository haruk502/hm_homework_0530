const { S3, ListObjectsCommand } = require('@aws-sdk/client-s3')

module.exports = function top(req, res) {
  const client = new S3()

  client.send(new ListObjectsCommand({ Bucket: 'rucca-test' }))
  .then(data => {
    const contents = data.Contents.map(o => { return { name: o.Key, size: o.Size } })
    const user = req.session.user
    res.render('top.ejs', { name: user.name, contents: contents })  
  })
}
