// Fixture data

//if (Preference.find().count() === 0) {
//  Preference.insert({
//    _id: 'theme', value: 'classic'
//  });
//}

if (Blogs.find().count() === 0) {
  var now = new Date().getTime();

  // create two users
  var testId = Meteor.users.insert({
    'username': 'test', 'emails': [ { 'address': 'test@test.com', 'verified': false}], 'createdAt': now - 10 * 3600 * 1000
  });
  var adminId = Meteor.users.insert({
    'username': 'admin', 'emails': [ { 'address': 'admin@test.com', 'verified': true}], 'createdAt': now - 20 * 3600 * 1000
  });

  // create posts
  Blogs.insert({
    user: { _id: testId, username: 'test'},
    title: '종교는 정치와 분리되고 국교는 인정되지 않습니다. 분석글입니다.',
    hitters: [],
    likers: [],
    count: {comment: 0, hits: 0, likes: 0},
    createdAt: now - 1 * 3600 * 1000,
    content: '<p>국교는 인정되지 아니하며, 종교와 정치는 분리된다. 군인은 현역을 면한 후가 아니면 국무총리로 임명될 수 없다. 법률안에 이의가 있을 때에는 대통령은 제1항의 기간내에 이의서를 붙여 국회로 환부하고, 그 재의를 요구할 수 있다. 국회의 폐회중에도 또한 같다. </p>'
});

Blogs.insert({
  user: { _id: adminId, username: 'admin'},
  title: '외국인의 국제법과 조약이 그 지위를 보장하나요?',
  hitters: [],
  likers: [],
  count: {comment: 0, hits: 0, likes: 0},
  createdAt: now - 2 * 3600 * 1000,
  content: '<p>모든 국민은 법률이 정하는 바에 의하여 선거권을 가진다. 외국인은 국제법과 조약이 정하는 바에 의하여 그 지위가 보장된다. 이 헌법시행 당시의 법령과 조약은 이 헌법에 위배되지 아니하는 한 그 효력을 지속한다. 감사위원은 원장의 제청으로 대통령이 임명하고, 그 임기는 4년으로 하며, 1차에 한하여 중임할 수 있다. </p>'
});

var testBlogId = Blogs.insert({
  user: { _id: testId, username: 'test'},
  title: '예비비는 국회의 의결을 거쳐야 하는가?',
  hitters: [],
  likers: [],
  count: {comment: 2, hits: 0, likes: 0},
  createdAt: now - 3 * 3600 * 1000,
  content: '<p>모든 국민은 직업선택의 자유를 가진다. 대통령의 국법상 행위는 문서로써 하며, 이 문서에는 국무총리와 관계 국무위원이 부서한다. 군사에 관한 것도 또한 같다. 이 헌법은 1988년 2월 25일부터 시행한다. </p>'
});

// create comments
BlogComments.insert({
  blogId: testBlogId,
  msg: '피드백 주세요',
  user: { _id: testId, username: 'test'},
  createdAt: now - 2 * 3600 * 1000
});

BlogComments.insert({
  blogId: testBlogId,
  msg: '좋아요 누르고 가요',
  user: { _id: adminId, username: 'admin'},
  createdAt: now - 1 * 3600 * 1000
});


for (var i = 0; i < 10; i++) {
  Blogs.insert({
    user: { _id: testId, username: 'test'},
    title: 'This week in Meteor #'+ i,
    hitters: [],
    likers: [],
    count: {comment: 0, hits: 0, likes: 0},
    createdAt: now - i * 3600 * 1000,
    content: '<p>감사위원은 원장의 제청으로 대통령이 임명하고, 그 임기는 4년으로 하며, 1차에 한하여 중임할 수 있다. 의원을 제명하려면 국회재적의원 3분의 2 이상의 찬성이 있어야 한다. 공공필요에 의한 재산권의 수용·사용 또는 제한 및 그에 대한 보상은 법률로써 하되, 정당한 보상을 지급하여야 한다. </p>'
});
}
}
