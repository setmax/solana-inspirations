use anchor_lang::prelude::*;

declare_id!("CkHLdN45PT1aJEmdjnjNWrCQSBiADdYXvLYQTFwhuZK");

#[program]
mod inc_with_pda {
    use super::*;

    pub fn create(ctx: Context<Create>, authority: Pubkey) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.authority = authority;
        counter.count = 0;
        counter.bump = *ctx.bumps.get("counter").unwrap();
        anchor_lang::solana_program::log::sol_log_compute_units();
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        anchor_lang::solana_program::log::sol_log_compute_units();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, seeds = [b"counter"], bump ,  payer = user, space = 8 + 32 + 8 + 1)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut, seeds = [b"counter"], bump = counter.bump,  has_one = authority)]
    pub counter: Account<'info, Counter>,
    pub authority: Signer<'info>,
}

#[account]
pub struct Counter {
    pub authority: Pubkey,
    pub count: u64,
    pub bump: u8,
}
