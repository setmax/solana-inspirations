import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { expect } from "chai";
import { IncWithPda } from "../target/types/inc_with_pda";

describe("inc-with-pda", async () => {

  anchor.setProvider(anchor.Provider.env());

  // Program for the tests.
  const program = anchor.workspace.IncWithPda as Program<IncWithPda>;

  it("Creates a counter and increment it with PDA", async () => {
    //calculate PDA
    const [counterAccountPDA, _] =
      await anchor.web3.PublicKey.findProgramAddress(
        [anchor.utils.bytes.utf8.encode("counter")],
        program.programId
      );

    await program.methods
      .create(anchor.Provider.env().wallet.publicKey)
      .accounts({
        counter: counterAccountPDA,
      })
      .rpc();

    //check address
    expect((await program.account.counter.fetch(counterAccountPDA)).authority.toBase58()).to.equal(anchor.Provider.env().wallet.publicKey.toBase58());

    //check value
    let actualCounterData = (await program.account.counter.fetch(counterAccountPDA)).count;
    expect(actualCounterData.toNumber()).is.equal(0);

    console.log(`before inc the counter is:${actualCounterData.toNumber()}`)


    await program.methods
      .increment()
      .accounts({
        counter: counterAccountPDA,
      })
      .rpc();

    //check value
    actualCounterData = (await program.account.counter.fetch(counterAccountPDA)).count;
    expect(actualCounterData.toNumber()).is.equal(1);

    console.log(`after inc the counter is:${actualCounterData.toNumber()}`)
  });
});
