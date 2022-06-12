import { css } from '@emotion/react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { getParsedCookies, setStringifiedCookies } from '../../util/cookies';
import { getBeanieBaby } from '../../util/database';

const beanieBabyInfoBox = css`
  background-color: #d3d3d3;
  border: 2px solid #828282;
  padding: 10px;
  display: flex;
  flex-direction: column;
  margin: 16px 0;
  border-radius: 20px;

  > h1,
  h2,
  h3 {
    text-align: center;
  }
  > div:nth-child(4) {
    margin: 0 auto;
  }
`;

const beanieBabyTakeMeBackLink = css`
  color: black;
  padding: 10px;
  font-weight: bold;
  border: 2px solid black;
  border-radius: 10px;
  width: 130px;
  transition: all 0.2s linear 0s;
  box-shadow: 4px 4px;

  :hover {
    z-index: 2;
    background-image: linear-gradient(
      to right,
      #e7484f,
      #e7484f 16.65%,
      #f68b1d 16.65%,
      #f68b1d 33.3%,
      #fced00 33.3%,
      #fced00 49.95%,
      #009e4f 49.95%,
      #009e4f 66.6%,
      #00aac3 66.6%,
      #00aac3 83.25%,
      #732982 83.25%,
      #732982 100%,
      #e7484f 100%
    );
    animation: slide 5s linear infinite;
    animation: slide 5s linear infinite;
    box-shadow: 0 0.5em 0.5em -0.4em var(--hover);
    transform: translateY(0.25em);
    transition: 0.3s;
  }
`;

const beanieBabyInfoPic = css`
  border-radius: 50%;
  filter: grayscale();
  margin: 0 auto;
`;

const buttonsStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  > div > h4 {
    margin: 5px;
  }
  > div > button {
    border: 1px black solid;
    border-radius: 8px;
    font-size: 20px;
    width: 30px;
    height: 30px;
    box-shadow: 4px 4px;
    :hover {
      box-shadow: 0 0.5em 0.5em -0.4em var(--hover);
      transform: translateY(0.25em);
      transition: 0.3s;
    }
  }

  > button {
    padding: 10px;
    border: 1px black solid;
    font-size: 30px;
    border-radius: 10px;
    box-shadow: 4px 4px;
  }
  > button :hover {
    z-index: 2;
    background-image: linear-gradient(
      to right,
      #e7484f,
      #e7484f 16.65%,
      #f68b1d 16.65%,
      #f68b1d 33.3%,
      #fced00 33.3%,
      #fced00 49.95%,
      #009e4f 49.95%,
      #009e4f 66.6%,
      #00aac3 66.6%,
      #00aac3 83.25%,
      #732982 83.25%,
      #732982 100%,
      #e7484f 100%
    );
    animation: slide 5s linear infinite;
    box-shadow: 0 0.5em 0.5em -0.4em var(--hover);
    transform: translateY(0.25em);
    transition: 0.3s;
  }

  @keyframes slide {
    to {
      background-position: 20vw;
    }
  }
`;

export default function BeanieBaby(props) {
  // check if the beanie baby is inside the diet by checking the property cartCounter

  // initialize the cartCounter with the value of the cookie or 0
  const [cartState, setCartState] = useState([]);
  console.log('this is the cartState', cartState);
  // getCartTotal();
  const cartTotal = cartState.reduce((acc, cartItem) => {
    return acc + cartItem.cartCounter;
  }, 0);
  console.log('this is cart total', cartTotal);
  const [beanieAmount, setBeanieAmount] = useState(1);

  const cartCounter = props.beanieBaby.cartCounter || 0;

  if (!props.beanieBaby.price) {
    return <div> Beanie Baby not found</div>;
  }
  return (
    <div>
      <div css={beanieBabyInfoBox}>
        <div css={beanieBabyTakeMeBackLink}>
          <Link href="/beanie_babies">
            <div>
              <i className="fa-solid fa-backward" /> Take Me Back{'  '}
              {/* <i className="fa-solid fa-backward" /> */}
            </div>
          </Link>
        </div>
        <h1>{props.beanieBaby.name}</h1>
        <h2>Animal: {props.beanieBaby.animal}</h2>
        <div>
          <Image
            css={beanieBabyInfoPic}
            src={`/${props.beanieBaby.id}.jpeg`}
            alt={`beanie baby ${props.beanieBaby.name}`}
            width="500"
            height="500"
          />
        </div>
        <h3>Price: {props.beanieBaby.price}</h3>

        <div css={buttonsStyles}>
          <div>
            <button
              onClick={() => {
                beanieAmount > 1
                  ? setBeanieAmount(beanieAmount - 1)
                  : setBeanieAmount(beanieAmount);
              }}
            >
              -
            </button>
            <h4>{beanieAmount}</h4>
            <button
              onClick={() => {
                setBeanieAmount(beanieAmount + 1);
              }}
            >
              +
            </button>
          </div>
          <br />
          <button
            onClick={() => {
              // 1. get the original array ( Cookies.get)

              const currentCart = getParsedCookies('cart');
              console.log('currentcart', currentCart);
              let newCart;
              const selectedBeanie = currentCart.find(
                (beanieBabyInCart) =>
                  props.beanieBaby.id === beanieBabyInCart.id,
              );
              let selectedCart = currentCart.filter(
                (beanieBabyInCart) =>
                  beanieBabyInCart.id !== props.beanieBaby.id,
              );

              // IS IT ALREADY IN COOKIES?
              if (selectedBeanie) {
                // IF ALREADY IN COOKIES -->
                newCart = [
                  ...selectedCart,
                  {
                    id: props.beanieBaby.id,
                    cartCounter: (cartCounter += beanieAmount),
                  },
                ];
                console.log('newCart', newCart, selectedBeanie);

                // newCart = currentCart.filter(
                //   (beanieBabyInCart) =>
                //     beanieBabyInCart.id !== props.beanieBaby.id,
                // );
                setCartState(newCart);
              }
              //// 2. add the value (spread operator)
              else {
                // IF NOT IN COOKIES -->
                newCart = [
                  ...currentCart,
                  {
                    id: props.beanieBaby.id,
                    cartCounter: beanieAmount,
                  },
                ];
                setCartState(newCart);
              }
              setStringifiedCookies('cart', newCart);
              console.log(currentCart);
              console.log(newCart);

              // 3. set the cookies to the new value

              // setStringifiedCookies('cart', newCart);
            }}
          >
            Add to Beanie Basket
          </button>
          <br />
          Total In Cart: {cartTotal}
        </div>
      </div>
    </div>
  );
}
export async function getServerSideProps(context) {
  const beanieBaby = await getBeanieBaby(context.query.beanieBabyId);

  return {
    props: {
      beanieBaby: beanieBaby || {},
    },
  };
}
