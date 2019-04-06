(module
 (type $FUNCSIG$ii (func (param i32) (result i32)))
 (type $FUNCSIG$v (func))
 (memory $0 0)
 (table $0 1 funcref)
 (elem (i32.const 0) $null)
 (export "memory" (memory $0))
 (export "table" (table $0))
 (export "hash" (func $src/wasm/superfasthash/hash))
 (func $src/wasm/superfasthash/hash (; 0 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  local.tee $1
  i32.const 2
  i32.shr_u
  local.set $3
  loop $repeat|0
   block $break|0
    local.get $3
    i32.const 0
    i32.le_u
    br_if $break|0
    local.get $2
    i32.load
    local.set $4
    local.get $2
    i32.const 4
    i32.add
    local.set $2
    local.get $4
    i32.const 65535
    i32.and
    local.get $1
    i32.add
    local.tee $1
    local.get $1
    i32.const 16
    i32.shl
    local.get $4
    i32.const 16
    i32.shr_u
    i32.const 11
    i32.shl
    i32.xor
    i32.xor
    local.tee $1
    local.get $1
    i32.const 11
    i32.shr_u
    i32.add
    local.set $1
    local.get $3
    i32.const 1
    i32.sub
    local.set $3
    br $repeat|0
   end
  end
  block $break|1
   block $case2|1
    block $case1|1
     local.get $0
     i32.const 3
     i32.and
     local.tee $0
     i32.const 3
     i32.ne
     if
      local.get $0
      i32.const 2
      i32.eq
      br_if $case1|1
      local.get $0
      i32.const 1
      i32.eq
      br_if $case2|1
      br $break|1
     end
     local.get $2
     i32.load
     local.tee $0
     i32.const 65535
     i32.and
     local.get $1
     i32.add
     local.tee $1
     local.get $1
     i32.const 16
     i32.shl
     i32.xor
     local.get $0
     i32.const 16
     i32.shr_u
     i32.const 255
     i32.and
     i32.const 18
     i32.shl
     i32.xor
     local.tee $0
     local.get $0
     i32.const 11
     i32.shr_u
     i32.add
     local.set $1
     br $break|1
    end
    local.get $2
    i32.load16_u
    local.get $1
    i32.add
    local.tee $0
    local.get $0
    i32.const 11
    i32.shl
    i32.xor
    local.tee $0
    local.get $0
    i32.const 17
    i32.shr_u
    i32.add
    local.set $1
    br $break|1
   end
   local.get $2
   i32.load8_u
   local.get $1
   i32.add
   local.tee $0
   local.get $0
   i32.const 10
   i32.shl
   i32.xor
   local.tee $0
   local.get $0
   i32.const 1
   i32.shr_u
   i32.add
   local.set $1
  end
  local.get $1
  i32.const 3
  i32.shl
  local.get $1
  i32.xor
  local.tee $0
  local.get $0
  i32.const 5
  i32.shr_u
  i32.add
  local.tee $0
  local.get $0
  i32.const 4
  i32.shl
  i32.xor
  local.tee $0
  local.get $0
  i32.const 17
  i32.shr_u
  i32.add
  local.tee $0
  local.get $0
  i32.const 25
  i32.shl
  i32.xor
  local.tee $0
  local.get $0
  i32.const 6
  i32.shr_u
  i32.add
 )
 (func $null (; 1 ;) (type $FUNCSIG$v)
  nop
 )
)
