import ReactModal from "react-modal";

if (typeof window !== undefined) {
    ReactModal.setAppElement("body");
}

// Three options when creating Modal
// 1. Js with js and isOpen Var
// 2. Give the Modal its own route when you hit that route it is open other wise it is closed.
// 3. Can store the state is search params -- when you change search params remix 
// loads all the data on the page because it does not know which routes will be effected. (The worst option)
// 4. If you don't have a loader in your Modal route no network will be involved. 
// This is because on route transition remix only loads the data that has changed. 
// It there is no loader there is no data to remix to fetch and it will use a client side route transition.

export default function UpdateMealPlan() {
    return <ReactModal isOpen={true}>Update Meal Plan</ReactModal>;
}