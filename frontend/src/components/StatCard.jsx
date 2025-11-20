export default function StatCard({ title, value, icon: Icon, color = 'bg-blue-500' }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`${color} p-4 rounded-full text-white`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
      </div>
    </div>
  )
}
