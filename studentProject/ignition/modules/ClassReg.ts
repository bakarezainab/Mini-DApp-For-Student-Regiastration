// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const ClassRegModule = buildModule("ClassRegModule", (m) => {

  const classReg = m.contract("ClassReg" );

  return { classReg};
});

export default ClassRegModule;
