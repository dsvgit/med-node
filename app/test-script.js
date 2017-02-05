db.getCollection('userresults').aggregate(
  [
    {$match: {userId: ObjectId("5885285a44aca5166ccfc162")}},
    {
      $project : {
        hour: { $hour: "$updated" },
        year: { $year: "$updated" },
        month: { $month: "$updated" },
        day: { $dayOfMonth: "$updated" },
        addedFoods: '$addedFoods',
        updated: '$updated',
        userId: '$userId'
      }
    },
    {$sort: {hour: -1, updated: -1}},
    {
      $group : {
        _id: { year: '$year', month: '$month', day: '$day', userId: '$userId' },
        addedFoods: { $first: '$addedFoods' },
        updated: { $first: '$updated' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }}
  ]
)