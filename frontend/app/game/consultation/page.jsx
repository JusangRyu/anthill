export default function ConsultationPage() {
  const consultations = [
    { id: 1, category: "[전략]", title: "개미의 생활 타이밍 조절법!!!", author: "하얀스파", likes: 30, date: "11/01" },
    { id: 2, category: "[족적]", title: "개미의 활발활활 개념디시다.", author: "콜롬비아육아", likes: 100, date: "11/02" },
    { id: 3, category: "[정보]", title: "오늘 오전에 제 육각안가요????", author: "투명파", likes: 50, date: "11/03" },
    { id: 4, category: "[질문]", title: "개미의 DM 안되는거 도와주세용?", author: "선홍파", likes: 77, date: "11/04" },
    { id: 5, category: "[정보]", title: "클랜고 더욱 개싸여 사동거네요.", author: "콜럼파", likes: 36, date: "11/05" },
    { id: 6, category: "[정보]", title: "유저님, 포드 나무 컨정식!!!", author: "백현파", likes: 42, date: "11/06" },
    { id: 7, category: "[정보]", title: "꽃잎마타가 자별 헌부먼 도를 Good!", author: "연마파", likes: 59, date: "11/07" },
    { id: 8, category: "[정보]", title: "오늘 동성두 새로조기 먹을 사람?", author: "한해파", likes: 61, date: "11/08" },
    { id: 9, category: "[정보]", title: "의지 역대해에 ... 전파가 찌되네...", author: "연규파", likes: 74, date: "11/09" },
    { id: 10, category: "[정보]", title: "의지 역대해에 ... 전파가 찌되네...", author: "선술파", likes: 88, date: "11/10" }
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">자유게시판</h1>
        <p className="text-gray-600">수다떨듯이 자유롭게 글을 올릴 수 있는 '자유'가 '테마'입니다.</p>
        <button className="mt-4 bg-[#E0C8FF] text-purple-900 font-semibold px-6 py-2 rounded-lg hover:bg-purple-300 transition-colors">
          글쓰기
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">게시글 종류</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">닉네임</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">조회수</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">날짜</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {consultations.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500 font-semibold">#{item.id}</span>
                    <span className="text-gray-700">{item.category}</span>
                    <span className="text-gray-900">{item.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{item.author}</td>
                <td className="px-6 py-4 text-gray-700">{item.likes}</td>
                <td className="px-6 py-4 text-gray-700">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button className="px-3 py-1 text-gray-600 hover:text-gray-900">이전</button>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-purple-400 text-white rounded">1</button>
          <button className="px-3 py-1 text-gray-600 hover:text-gray-900">2</button>
          <button className="px-3 py-1 text-gray-600 hover:text-gray-900">3</button>
          <button className="px-3 py-1 text-gray-600 hover:text-gray-900">4</button>
          <button className="px-3 py-1 text-gray-600 hover:text-gray-900">5</button>
        </div>
        <button className="px-3 py-1 text-gray-600 hover:text-gray-900">다음</button>
      </div>
    </div>
  )
}


