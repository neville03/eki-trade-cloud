import Button from "../components/Button";

const FeedbackPage = ({ feedback = [] }) => (
  <section className="space-y-6">
    <h2 className="text-xl font-bold">Feedback</h2>
    <div className="bg-white rounded shadow p-6">
      {feedback.length === 0 ? (
        <div className="text-gray-500 text-center">No feedback yet.</div>
      ) : (
        <ul className="divide-y">
          {feedback.map(item => (
            <li key={item.id} className="py-4 flex justify-between items-center">
              <div>
                <div className="font-medium">{item.user}</div>
                <div className="text-sm text-gray-600">{item.comment}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </section>
);

export default FeedbackPage;
