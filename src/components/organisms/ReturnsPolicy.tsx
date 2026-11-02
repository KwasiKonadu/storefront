import { TextLink } from '@/components/atoms';
import { CFG } from '@/lib/config';

export function ReturnsPolicy() {
  const days = CFG.returnDays;
  if (days == null) {
    return (
      <div className="prose" style={{ paddingBottom: 60 }}>
        <h2>Returns</h2>
        <p>Our returns policy will be published here soon. If something is wrong with an order, please get in touch and we will sort it out.</p>
      </div>
    );
  }
  return (
    <div className="prose" style={{ paddingBottom: 60 }}>
      <h2>{days}-day returns</h2>
      <p>
        You can request a return within {days} days of receiving a completed order. Open the order in <TextLink href="/orders">My Orders</TextLink>, choose <b>Request a return</b>, and select the items, quantities and a reason. Items should be unused and in original packaging.
      </p>
      <h2>How the request works</h2>
      <ul>
        <li>Submitting a request creates a record the store reviews — it is <b>not</b> an automatic refund or a completed financial transaction.</li>
        <li>You’ll see the request status on the order page: first <b>request received</b>, then the store’s decision.</li>
        <li>Once approved, refunds are arranged with the store, in the same way you paid.</li>
      </ul>
      <h2>Cancellations</h2>
      <p>Orders can be cancelled yourself while they are <b>pending confirmation</b> or <b>confirmed</b> — the button is right on the order page, and stock is returned to the shelf automatically. Once an order is processing or beyond, the cancellation window has closed; contact us and we’ll do our best.</p>
      <h2>Damaged or wrong items</h2>
      <p>If something arrives damaged or isn’t what you ordered, request a return with the reason and a note — we make these right first, every time.</p>
    </div>
  );
}
