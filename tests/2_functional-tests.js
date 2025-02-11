const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('POST /api/issues/{project}',() => {
    test('Create an issue with every field', (done) => {
        chai
            .request(server)
            .post('/api/issues/test')
            .send({
              issue_title: 'Test POST new issue',
              issue_text: 'This is post test',
              created_by: 'Chai-test',
              assigned_to: 'code',
              status_text: 'In progress'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, '_id');
                assert.property(res.body, 'created_on');
                assert.property(res.body, 'updated_on');
                assert.property(res.body, 'open');
                test_id = res.body._id;  
                done();
            });
      });
    
    test('Create an issue with only required fields', (done)=>{
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Test only req field',
          issue_text: 'Req test',
          created_by: 'Chai-test',
        })
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.isObject(res.body);
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          done();
        })
    })

    test('Creating issue with missing required fields', (done) =>{
      chai.request(server)
        .post('/api/issues/test')
        .send({ issue_text: 'No title' })
        .end((err,res)=>{
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'required field(s) missing' });
          done()
        });
    });
  });

  suite('GET /api/issues/{project}',() => { 
    before((done)=>{
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Get test data',
          issue_text: 'This is get test',
          created_by: 'Chai--get-test',
          assigned_to: 'getTest',
          status_text: 'In progress'
          })
        .end((err,res)=>{
          if(err) return done(err);
          assert.equal(res.status, 200)
          done()
        })
    })
    test('View all issues on a project',(done)=>{
      chai.request(server)
        .get('/api/issues/test')
        .end((err,res)=>{
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAtLeast(res.body.length,1);
          done();
        })
    })

    before((done)=>{
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Get test data',
          issue_text: 'This is get test',
          created_by: 'Chai--get-test',
          assigned_to: 'getTest',
          status_text: 'In progress'
          })
        .end((err,res)=>{
          if(err) return done(err);
          assert.equal(res.status, 200)
          done()
        })
    })
    test('View issues on a project with one filter',(done)=>{
      chai.request(server)
        .get('/api/issues/test?created_by=Chai--get-test')
        .end((err,res)=>{
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAtLeast(res.body.length,1);
          res.body.forEach(issue => assert.equal(issue.created_by, 'Chai--get-test'));
          done();
        })
    })

    before((done)=>{
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Get test data',
          issue_text: 'This is get test',
          created_by: 'Chai--get-test',
          assigned_to: 'getTest',
          status_text: 'In progress'
          })
        .end((err,res)=>{
          if(err) return done(err);
          assert.equal(res.status, 200)
          done()
        })
    })

    test('View issues on a project with multiple filters',(done)=>{
      chai.request(server)
        .get('/api/issues/test?created_by=Chai--get-test&assigned_to=getTest')
        .end((err,res)=>{
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAtLeast(res.body.length,1);

          res.body.forEach(issue => {
            assert.equal(issue.created_by, 'Chai--get-test')
            assert.equal(issue.assigned_to, 'getTest')
          });
          done();
        })
    })
  })  

  suite('PUT /api/issues/{project}',() => {
    before((done)=>{
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'POST test data',
          issue_text: 'This is post test',
          created_by: 'Chai-post-test',
          assigned_to: 'postTest',
          })
        .end((err,res)=>{
          if(err) return done(err);
          assert.equal(res.status, 200)
          testIssueId = res.body._id;
          done()
        })
    })

    test('Update one field on an issue',(done)=>{
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: testIssueId,
          issue_text: 'Edited text'
        })
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { result: 'successfully updated', _id: testIssueId });
          done();
        })
    })
    
    test('Update multiple fields on an issue',(done)=>{ 
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: testIssueId,
          issue_text: 'Edited text',
          created_by: 'Chai-post-test-edited',
        })
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { result: 'successfully updated', _id: testIssueId });
        done();
      })
    })  

    test('Update an issue with missing _id',(done)=>{
      chai.request(server)
        .put('/api/issues/test')
        .send({
          issue_text: 'Edited text',
          created_by: 'Chai-post-test-edited',
        })
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { error: 'missing _id' });
        done();
      })
    })

    test('Update an issue with no fields to update',(done)=>{
      chai.request(server)
      .put('/api/issues/test')
      .send({
        _id: testIssueId,
      })
      .end((err,res)=>{
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { error: 'no update field(s) sent', '_id': testIssueId });
      done();
      })

    })

    test('Update an issue with an invalid _id',(done)=>{
      chai.request(server)
      .put('/api/issues/test')
      .send({
        _id: 'invalid',
        issue_text: 'Edited text-invalid id',
        created_by: 'Chai-post-test-edited',
      })
      .end((err,res)=>{
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { error: 'could not update', '_id': 'invalid' });
      done();
     })

    })
  })

  suite('DELETE /api/issues/{project}',() => {
    before((done)=>{
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Delete test data',
          issue_text: 'This is delete test',
          created_by: 'Chai-delete-test',
          })
        .end((err,res)=>{
          if(err) return done(err);
          assert.equal(res.status, 200)
          deleteTestIssueId = res.body._id;
          done()
        })
    })  
    test('Delete an issue',(done)=>{
      chai.request(server)
      .delete('/api/issues/test')
      .send({_id: deleteTestIssueId})
      .end((err,res)=>{
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { result: 'successfully deleted', '_id': deleteTestIssueId });
      done();
     })
    })
    
    before((done)=>{
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Delete test data',
          issue_text: 'This is delete test - should fail',
          created_by: 'Chai-delete-test',
          })
        .end((err,res)=>{
          if(err) return done(err);
          assert.equal(res.status, 200)
          testIssueId = res.body._id;
          done()
        })
    })  
    test('Delete an issue with an invalid _id',(done)=>{
      chai.request(server)
      .delete('/api/issues/test')
      .send({_id: 'invalid_ID'})
      .end((err,res)=>{
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { error: 'could not delete', '_id': 'invalid_ID' });
      done();
     })
    })
    test('Delete an issue with missing _id',(done)=>{
      chai.request(server)
      .delete('/api/issues/test')
      .send({})
      .end((err,res)=>{
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, {  error: 'missing _id' });
      done();
     })
    })

  });
  
});