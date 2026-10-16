import React from "react";
import InnerPageHero from "../../components/InnerPageHero/InnerPageHero";
import "./ShippingDelivery.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const ShippingDelivery = () => {
  return (
    <>
    <Navbar />
     <div className="shipping-page">

      {/* Hero */}
      <InnerPageHero
        title="Shipping & Delivery"
        description="We value the diverse perspectives and experiences of our users, and we encourage collaboration and community engagement. Our platform provides opportunities for users to contribute their knowledge, share their opinions."
        backText="Back to Home"
        backPath="/"
      />

      {/* Shipping Content */}
      <section className="shipping-section">
        <div className="shipping-container">

          <h2>Shipping & Delivery</h2>

          <p>
            Our policy lasts 30 days. If 30 days have gone by since your
            purchase, unfortunately we can't offer you a refund or exchange.
          </p>

          <p>
            To be eligible for a return, your item must be unused and in the
            same condition that you received it. It must also be in the
            original packaging.
          </p>

          <p>
            Several types of goods are exempt from being returned. Perishable
            goods such as food, flowers, newspapers or magazines cannot be
            returned. We also do not accept products that are intimate or
            sanitary goods, hazardous materials, or flammable liquids or gases.
          </p>

          <h3>Additional non-returnable items:</h3>

          <ul>
            <li>Gift cards</li>
            <li>Downloadable software products</li>
            <li>Some health and personal care items</li>
          </ul>

          <p>
            To complete your return, we require a receipt or proof of purchase.
          </p>

          <p>
            Please do not send your purchase back to the manufacturer.
          </p>

          <p>
            There are certain situations where only partial refunds are
            granted (if applicable).
          </p>

          <ul>
            <li>Book with obvious signs of use</li>
            <li>
              CD, DVD, VHS tape, software, video game, cassette tape, or
              vinyl record that has been opened
            </li>
            <li>
              Any item not in its original condition, is damaged or missing
              parts for reasons not due to our error
            </li>
            <li>Any item that is returned more than 30 days after delivery</li>
          </ul>

          {/* Refunds */}
          <div className="shipping-block">
            <h3>Refunds (if applicable)</h3>

            <p>
              Once your return is received and inspected, we will send you an
              email to notify you that we have received your returned item.
              We will also notify you of the approval or rejection of your
              refund.
            </p>

            <p>
              If you are approved, then your refund will be processed, and a
              credit will automatically be applied to your credit card or
              original method of payment, within a certain amount of days.
            </p>

            <p>Late or missing refunds (if applicable).</p>

            <p>
              If you haven't received a refund yet, first check your bank
              account again.
            </p>

            <p>
              Then contact your credit card company. It may take some time
              before your refund is officially posted.
            </p>

            <p>
              Next contact your bank. There is often some processing time
              before a refund is posted.
            </p>

            <p>
              If you've done all of this and you still have not received your
              refund yet, please contact us.
            </p>

            <p>
              Once your refund has been approved, the amount will be credited
              back to the original payment method used for your purchase.
            </p>
          </div>

          {/* Exchanges */}
          <div className="shipping-block">
            <h3>Exchanges (if applicable)</h3>

            <p>
              We only replace items if they are defective or damaged. If you
              need to exchange it for the same item, please contact our
              support team and send your item to the specified return address.
            </p>

            <p>
              Exchange requests must be made within the applicable return
              period and the item must meet the required return conditions.
            </p>
          </div>

          {/* Gifts */}
          <div className="shipping-block">
            <h3>Gifts</h3>

            <p>
              If the item was marked as a gift when purchased and shipped
              directly to you, you'll receive a gift credit for the value of
              your return. Once the returned item is received, a gift
              certificate will be mailed to you.
            </p>

            <p>
              If the item wasn't marked as a gift when purchased, or the gift
              giver had the order shipped to themselves to give to you later,
              we will send a refund to the gift giver and they will find out
              about your return.
            </p>
          </div>

          {/* Shipping */}
          <div className="shipping-block">
            <h3>Shipping</h3>

            <p>
              To return your product, you should mail your product to the
              return address provided by our support team.
            </p>

            <p>
              You will be responsible for paying for your own shipping costs
              for returning your item. Shipping costs are non-refundable. If
              you receive a refund, the cost of return shipping will be
              deducted from your refund.
            </p>

            <p>
              Depending on where you live, the time it may take for your
              exchanged product to reach you may vary.
            </p>

            <p>
              If you are shipping an item over $75, you should consider using
              a trackable shipping service or purchasing shipping insurance.
              We don't guarantee that we will receive your returned item.
            </p>

            <p>
              Please make sure that the package is securely packed to prevent
              damage during transportation.
            </p>
          </div>

          {/* Delivery Information */}
          <div className="shipping-block">
            <h3>Delivery Information</h3>

            <p>
              Orders are generally processed within the applicable processing
              time after the order has been confirmed.
            </p>

            <p>
              Delivery time may vary depending on the delivery location,
              availability of the product, shipping method, and other
              circumstances.
            </p>

            <p>
              Customers are responsible for providing accurate shipping
              information. Any delay caused by incorrect or incomplete
              delivery information may affect the delivery time.
            </p>
          </div>

          {/* Contact */}
          <div className="shipping-block">
            <h3>Need Help?</h3>

            <p>
              If you have any questions regarding shipping, delivery, returns,
              refunds, or exchanges, please contact our support team. We will
              be happy to assist you with your request.
            </p>
          </div>

        </div>
      </section>

    </div>

    <Footer />
    </>
   
  );
};

export default ShippingDelivery;