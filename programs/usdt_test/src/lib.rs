// Rust smart contract using Anchor framework for Solana
// This contract allows sending and querying balances for a token (like USDT).
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer as SplTransfer};
use solana_program::system_instruction;

declare_id!("8w6xJmQkUL28ky3s4yCS8TvSCQxhZbZfmkQbccqvL3XK");

#[program]
pub mod usdt_test {
    use super::*;
 
    pub fn send_usdt(ctx: Context<SendUsdt>, amount: u64) -> Result<()> {
        let destination = &ctx.accounts.to_ata;
        let source = &ctx.accounts.from_ata;
        let token_program = &ctx.accounts.token_program;
        let authority = &ctx.accounts.from;

        // Transfer tokens from taker to initializer
        let cpi_accounts = SplTransfer {
            from: source.to_account_info().clone(),
            to: destination.to_account_info().clone(),
            authority: authority.to_account_info().clone(),
        };
        let cpi_program = token_program.to_account_info();
        
        token::transfer(
            CpiContext::new(cpi_program, cpi_accounts),
            amount)?;
        Ok(())
    }
 
    pub fn get_tokens_balance(ctx: Context<GetBalance>) -> Result<u64> {
        let balance = ctx.accounts.token_account.amount;
        msg!("Balance: {}", balance);
        Ok(balance)
    }
}

#[derive(Accounts)]
pub struct SendUsdt<'info> {
    pub from: Signer<'info>,
    #[account(mut)]
    pub from_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to_ata: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}
 
#[derive(Accounts)]
pub struct GetBalance<'info> {
    pub token_account: Account<'info, TokenAccount>, // Token account to query
}